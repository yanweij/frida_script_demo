// 解密lua脚本

//  https://www.bookstack.cn/read/lua-5.3/spilt.33.spilt.1.5.md

// int luaL_loadbuffer (lua_State *L,
//                      const char *buff,
//                      size_t sz,
//                      const char *name);
// 等价于 luaL_loadbufferx，其 mode 参数等于 NULL。

//  int luaL_loadbufferx (lua_State *L,
//                        const char *buff,
//                        size_t sz,
//                        const char *name,
//                        const char *mode);
//  把一段缓存加载为一个 Lua 代码块。这个函数使用 lua_load 来加载 buff 指向的长度为 sz 的内存区。
//  这个函数和 lua_load 返回值相同。name 作为代码块的名字，用于调试信息和错误消息。mode 字符串的作用同函数 lua_load。



function hook_loadbuffer(name_so){
    var addr = Module.findExportByName(name_so, "luaL_loadbufferx");
    console.log("hook: "+ name_so  + " addr: " + addr);
    Interceptor.attach(addr, {
        onEnter: function(args) {
            var name = Memory.readUtf8String(args[3]);
            var obj = {}
            obj.size = args[2].toInt32()
            obj.name = name;
            obj.content = Memory.readCString(args[1], obj.size);
            send(obj);
        }
    } )
}

//  luaL_loadbufferx    libcocos2dcpp.so
//  luaL_loadbufferx    libcocos2dlua.so
//  luaL_loadbuffer     libtolua.so

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

    