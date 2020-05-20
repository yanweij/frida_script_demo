# -*- coding: utf-8 -*

import frida, sys, os



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

		# 大部分包 用这个
	if name.endswith('.luac'):
		name = name.replace(".luac", ".lua")
		#write(sys.argv[2] + name, content)

	try:
		if sys.argv[3] in name:
			file = open(sys.argv[2] + name, "rb+")
			data = file.read();
		else:
			# 覆盖
			if len(name) < 200 :
				write(sys.argv[2] + name, content)
			data = ""
	except IOError:
		# 执行失败
	    write(sys.argv[2] + name, content)
	    script.post({'type': 'input', 'payload': "", "datasize": 0})
	else:
		# 执行成功
		# if file :
		# 	file.close();
		if data != "":
			script.post({'type': 'input', 'payload': data.decode('utf-8'), "datasize": len(data)});
		else:
			script.post({'type': 'input', 'payload': "", "datasize": 0})
	#print("replace lua send");
	

if __name__ == "__main__":
	if len(sys.argv) < 2 :
		print("start error")
		sys.exit()

	print("app attach: ", sys.argv)
	dev = frida.get_usb_device()
	process = dev.attach(sys.argv[1])

	with open('./replace_lua.js', 'r') as f:
		jscode = f.read()
	#print("js file: ", jscode)
	script = process.create_script(jscode)
	script.on('message', on_message)
	script.load()
	print('dumplua success ...', sys.argv[2])
	sys.stdin.read()
	
