function login(){
    Java.perform(function(){
        console.log("frida insert android")
        var loginActivity = Java.use("com.example.androiddemo.Activity.LoginActivity")
        loginActivity.a.overload('java.lang.String', 'java.lang.String').implementation =function(p1, p2){
            var r = this.a(p1, p2)
            console.log("return ", p1, p2, r)
            return Java.use("java.lang.String").$new("1234");
        }
    })
}
function challenge1() {
    Java.perform(function(){
        var fridaActivity = Java.use("com.example.androiddemo.Activity.FridaActivity1")
        fridaActivity.a.implementation = function(p) {
            return Java.use("java.lang.String").$new("R4jSLLLLLLLLLLOrLE7/5B+Z6fsl65yj6BgC6YWz66gO6g2t65Pk6a+P65NK44NNROl0wNOLLLL=")
        }
    })
}
function challenge2() {
    Java.perform(function(){
        var fridaActivity = Java.use("com.example.androiddemo.Activity.FridaActivity2")
        //静态函数可以直接调用
        fridaActivity.setStatic_bool_var()
        //动态函数用 java.choose
        Java.choose("com.example.androiddemo.Activity.FridaActivity2", {
            onMatch:function(instance){
                console.log("choose instance: ", instance)
                instance.setBool_var()
            },onComplete:function(){}
        })
    })
}
function challenge3() {
    Java.perform(function(){
        var fridaActivity = Java.use("com.example.androiddemo.Activity.FridaActivity3")
        //静态成员变量 可以直接赋值
        fridaActivity.static_bool_var.value = true
        //动态成员变量 用choose
        Java.choose("com.example.androiddemo.Activity.FridaActivity3", {
            onMatch:function(instance){
                console.log("choose instance: ", instance.bool_var.value)
                console.log("choose instance: ", instance._same_name_bool_var.value)
                instance.bool_var.value = true
                instance._same_name_bool_var.value = true
            },onComplete:function(){}
        })

    })
}
function challenge4() {
    Java.perform(function(){
        // hook 内部类
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check1.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check2.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check3.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check4.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check5.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses").check6.implementation = function(){return true}
    })
}
function challenge42() {
    Java.perform(function(){
        var class_name = "com.example.androiddemo.Activity.FridaActivity4$InnerClasses"
        var fridaActivity = Java.use(class_name)
        var all_method = fridaActivity.class.getDeclaredMethods();
        //console.log(all_method)
        // hook 类的所有方法
        for(var i= 0; i < all_method.length; i++)
        {
            
            var method = all_method[i]
            var methodStr = method.toString()
            var subString = methodStr.substr(methodStr.indexOf(class_name) + class_name.length + 1)
            var finalMethodStr = subString.substr(0, subString.indexOf("("))
            fridaActivity[finalMethodStr].implementation = function(){return true}
            console.log(finalMethodStr)
        }
    })
}
// hook interface 
// hook 动态加载类
function challenge5(){
    Java.perform(function(){
       Java.choose('com.example.androiddemo.Activity.FridaActivity5', {
           onMatch:function(instance){
               console.log(instance.getDynamicDexCheck().$className)
           },onComplete:function(){}
       })
       Java.enumerateClassLoaders({
           onMatch:function(loader){
               try{
                    if(loader.findClass("com.example.androiddemo.Dynamic.DynamicCheck")){
                        console.log("find", loader)
                        Java.classFactory.loader = loader
                    }
               }catch(error){
                   //console.log("catch error", error)
               }
           }, onComplete:function(){}   
       })
       var dynmaic = Java.use("com.example.androiddemo.Dynamic.DynamicCheck")
        dynmaic.check.implementation = function(){
            return true
        }
    })
}

function challenge6(){
    Java.perform(function(){
        Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class0").check.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class1").check.implementation = function(){return true}
        Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class2").check.implementation = function(){return true}
    })
}
// 枚举类
function challenge62(){
    Java.perform(function(){
        Java.enumerateLoadedClasses({
            onMatch:function(name, handler){
                if(name.indexOf("com.example.androiddemo.Activity.Frida6.Frida6") >= 0){
                    console.log("name: ",name, handler)
                    Java.use(name).check.implementation = function(){return true}
                }

            }, onComplete:function(){}
        })
    })
}
function challenge7(){
    Java.perform(function(){

    })
}
setImmediate(challenge7)
