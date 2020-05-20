import frida
import os
import time

app = "com.xxx.xxx";

deviceIds = [];
devices = frida.enumerate_devices();
for device in devices :
    # print(device)
    ## 枚举所有通过wifiadb 连的机器
    if device.id.find(":") > 0:
        #print(device.id)
        deviceIds.append(device.id.replace("5555", "9999"))

for id in deviceIds :
    print(id)
    device = frida.get_device_manager().add_remote_device(id)
    print(device)
    pid = device.spawn([app])
    print(pid)
    device.resume(pid)
    time.sleep(1)
    session = device.attach(pid)
    with open("load_hook.js") as f:
        script = session.create_script(f.read())
        script.load()
input()
    
