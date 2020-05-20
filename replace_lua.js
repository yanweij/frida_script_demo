// 替换lua脚本

function hook_loadbuffer(name_so){
    var addr = Module.findExportByName(name_so, "luaL_loadbuffer");
    console.log("hook: "+ name_so  + " addr: " + addr);
    var tmpbuf;
    var tmpsize;
    Interceptor.attach(addr, {
            onEnter: function (args) {
                var name = Memory.readUtf8String(args[3]);

                var obj = {}
                obj.size = args[2].toInt32()
                obj.name = name;
                obj.content = Memory.readCString(args[1], obj.size);
                send(obj);
                if(name.includes("bf.luac")){
                    console.log("bf: " + obj.content);
                }   

                var op = recv('input', function(value) {
                    tmpbuf = value.payload;
                    tmpsize = value.datasize;
                });
                op.wait();

                // 去掉实名认证模块
                if(name.includes("CellDefendYMN")) {
                    this.buf = Memory.alloc(obj.size);
                    //Memory.writeUtf8String(this.buf, tmpbuf);
                    // hex 打印
                    //console.log(hexdump(this.buf, {offset: 0, length: tmpsize, header: false, ansi: false}));
                    // 替换参数(参数2，参数3) 走自己的逻辑
                    args[1] = this.buf;
                    //args[2] = ptr(tmpsize);
                    console.log("hook successful : " + name + " " + tmpsize);
                }

                // 申请新的内存 附值
                if (tmpsize != 0) {
                    this.buf = Memory.alloc(tmpsize);
                    Memory.writeUtf8String(this.buf, tmpbuf);
                    // hex 打印
                    //console.log(hexdump(this.buf, {offset: 0, length: tmpsize, header: false, ansi: false}));
                    // 替换参数(参数2，参数3) 走自己的逻辑
                    args[1] = this.buf;
                    args[2] = ptr(tmpsize);
                    console.log("hook successful : " + name + " " + tmpsize);
                }
            },
            onLeave:function(retval){
              // if(tmpsize){
              //   // 查看 返回值
              //   //console.log("leave.... " + retval.toInt32())
              //   tmpsize = 0
              // }
            }
    })
}

function start_hook() {
    var library_loaded = 0;
    var sos = ["tmp", "libcocos2dlua.so", "libcocos2dcpp.so", "libtolua.so"];
    var addrr = Module.findExportByName("libnativeloader.so", 
        '_ZN7android17OpenNativeLibraryEP7_JNIEnviPKcP8_jobjectP8_jstringPbPNSt3__112basic_stringIcNS9_11char_traitsIcEENS9_9allocatorIcEEEE');
    console.log("hook libnativeloader: " + addrr);
    Interceptor.attach(addrr,{
        onEnter: function(args){
            // first arg is the path to the library loaded
            var path = Memory.readUtf8String(args[2])
            //console.log("path: " + path);
            if(path.includes("libcocos2dlua.so")){
                console.log("[...] Loading library : " + path);
                library_loaded = 1;
            }else if(path.includes("libcocos2dcpp.so")){
                console.log("[...] Loading library : " + path);
                library_loaded = 2;
            }else if(path.includes("libtolua.so")) {
                console.log("[...] Loading library : " + path);
                library_loaded = 3;
            }
            
        },
        onLeave: function(args){
            if(library_loaded != 0) {
                console.log("[-] hook_loadbuffer... ", library_loaded);
                hook_loadbuffer(sos[library_loaded]);
                library_loaded = 0;
            }
        }
    })
}

start_hook()
