# -*- coding: utf-8 -*

import frida, sys, os


# 使用方法
# python3.7 dump_lua.py com.xxxx.xx ./xxxxx/

def write(path, content):
    #dirpath, filename = os.path.split(path)
    #print('write:####### ', path)
    folder = os.path.dirname(path)
    if not os.path.exists(folder):
        os.makedirs(folder)
    open(path, 'w').write(content)

def on_message(message, data):
	# print 'message:',message
	name = message['payload']['name']
	#content = message['payload']['content'].encode('utf-8')
	content = message['payload']['content']

	# if 'return' not in name:
	# 	print(name)
	# 	write(sys.argv[2] + name + ".lua", content)
	
	# 大部分包 用这个
	if name.endswith('.luac'):
		name = name.replace(".luac", ".lua")
		write(sys.argv[2] + name, content)

if __name__ == "__main__":
	if len(sys.argv) < 3 :
		print("start error")
		sys.exit()

	print("app attach: ", sys.argv)
	dev = frida.get_usb_device()
	process = dev.attach(sys.argv[1])

	with open('./dump_lua.js', 'r') as f:
		jscode = f.read()
	#print("js file: ", jscode)
	script = process.create_script(jscode)
	script.on('message', on_message)
	script.load()
	print('dumplua success ...', sys.argv[2])
	sys.stdin.read()
	
