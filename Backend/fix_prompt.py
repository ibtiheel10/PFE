with open('src/ai/ai.service.ts', 'rb') as f:
    content = f.read()

# Find and replace the double-plus bug
old = b"QCM techniques pour ce poste:\\\\n' + +"
new  = b"QCM techniques pour ce poste:\\\\n' +"

if old in content:
    content = content.replace(old, new)
    with open('src/ai/ai.service.ts', 'wb') as f:
        f.write(content)
    print('FIXED - double plus removed')
else:
    # Try alternate forms
    old2 = "QCM techniques pour ce poste:\\n' + +".encode('utf-8')
    if old2 in content:
        content = content.replace(old2, "QCM techniques pour ce poste:\\n' +".encode('utf-8'))
        with open('src/ai/ai.service.ts', 'wb') as f:
            f.write(content)
        print('FIXED - alternate form')
    else:
        # Show what's around that area
        idx = content.find(b'pour ce poste')
        if idx >= 0:
            print('Found at:', idx)
            print('Context:', repr(content[idx:idx+60]))
        else:
            print('Pattern not found at all')
