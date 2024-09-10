#!/usr/bin/env python3

import os,sys
curdir = "`pwd`" if sys.platform in ["linux", "darwin"] else "%cd%"
#https://code.visualstudio.com/api/extension-guides/tree-view
"""
https://www.soscisurvey.de/tools/view-chars.php
https://stackoverflow.com/questions/57186018/referenceerror-headers-is-not-defined-when-using-headers-in-a-server-side-ren#answer-75956506
"""

"""
https://code.visualstudio.com/api/extension-guides/tree-view

https://www.google.com/search?q=vs+code+extension+treeDataProvider+how+to+update&oq=vs+code+extension+treeDataProvider+how+to+update&aqs=chrome..69i57j33i10i160l5.5516j0j7&sourceid=chrome&ie=UTF-8
https://stackoverflow.com/questions/72312235/how-to-refresh-vscode-treedataprovider-based-treeview
https://stackoverflow.com/questions/56534723/simple-example-to-implement-vs-code-treedataprovider-with-json-data

https://code.visualstudio.com/api/extension-guides/tree-view


V Samples V
https://github.com/microsoft/vscode-extension-samples/



nonsense
https://github.com/microsoft/vscode/blob/15b8f1f9f6990d5535197ec41f0a112bf0e5dd31/src/vs/workbench/contrib/markers/common/markers.ts#L34


// https://stackoverflow.com/questions/51179496/ask-a-user-for-several-values-in-vscode-extension

tested commands
    let testedCommands = [
        'problems.action.showMultilineMessage',
        'problems.action.open',
        'workbench.actions.view.toggleProblems',
        'markers.panel.title.problems',
        'problems.action.open',
        'problems.action.openToSide',
        'problems.action.showQuickFixes',
        'workbench.action.problems.focus',
        'problems.action.copy',
        'problems.action.copyMessage',
        'problems.action.copyRelatedInformationMessage',
        'problems.action.focusProblemsFromFilter',
        'problems.action.focusFilter',
        'problems.action.showMultilineMessage',
        'problems.action.showSinglelineMessage',
        'problems.action.clearFilterText',
        'workbench.actions.view.problems',
    ];

//https://stackoverflow.com/questions/44733028/how-to-close-textdocument-in-vs-code
//CLOSING THE TEXT EDITORS - all but the test


//https://www.scaler.com/topics/javascript-nullish-coalescing-operator/

# https://www.google.com/search?q=sysctl%3A+setting+key+%22kernel.unprivileged_userns_clone%22%2C+ignoring%3A+Read-only+file+system&oq=sysctl%3A+setting+key+%22kernel.unprivileged_userns_clone%22%2C+ignoring%3A+Read-only+file+system&aqs=chrome..69i57j69i58.2737j0j4&sourceid=chrome&ie=UTF-8


https://stackoverflow.com/questions/62879698/any-tips-on-context-manager-similar-to-python-in-javascript

https://jordaneldredge.com/blog/implementing-pythons-context-manager-pattern-in-javascript/
"""

def run(cmd):
	print(cmd);os.system(cmd)


def env():
	run(
        """docker run  --rm -it -v "{0}:/sync"   -p 6902:6901 --privileged --shm-size=512m -e VNC_PW=password  frantzme/dev:ui "/bin/bash echo \"sudo apt-get install -y npm && sudo npm install -g npm@latest\" >> /home/kasm-user/.bashrc && /bin/bash" """.format(curdir)
    )

def vsExtensions():
    for x in [
        "dbaeumer.vscode-eslint",
        "Gerrnperl.outline-map",
        "esbenp.prettier-vscode",
        "ms-python.vscode-pylance",
        "ms-python.python",
        "amodio.tsl-problem-matcher",
        "k--kato.intellij-idea-keybindings",
    ]:
        run("code --install-extension {0}".format(x))

def preppy():
     for x in [
        """echo "import os,sys,requests\nvec = requests.get('http://google.com')\nprint(vec)" > ~/Downloads/temp.py"""
     ]:
        run(x)

def ini():
    for x in [
        "sudo apt-get update",
        "sudo apt-get --fix-missing",
        "sudo apt-get install -y python3-pip npm xz-utils",
        "wget https://nodejs.org/dist/v20.0.0/node-v20.0.0-linux-x64.tar.xz -O /tmp/node.tar.xz", #https://nodejs.org/en/download/current
        "sudo tar -C /usr/local --strip-components 1 -xJf /tmp/node.tar.xz",
        "sudo npm install -g npm@latest",
        "{0} -m pip install --upgrade mystring lsprotocol pygls astroid nox debugpy".format(sys.executable),
    ]:
        run(x)
    preppy()

def prep():
    for x in [
        "{0} -m nox --session setup".format(sys.executable),
        "npm install"
    ]:
        run(x)

def generate_cert():
    """
    # NOT THROUGH VT
    Invalid domain name. Domain names must end with one of the following: [bev.net,bev.org,vcom.edu,vt.edu,cyberinitiative.org,cyberinitiative-swva.org,marialliance.org,marialliance.net,marialliance.com,midatlanticresearch.net,marialliance.info]

    > https://vt4help.service-now.com/kb_view.do?sysparm_article=KB0010333
    > https://certs.it.vt.edu/help
    > https://certs.it.vt.edu/request/incommon/server

    # Using Self-signed
    https://www.tutorialspoint.com/linux_admin/linux_admin_create_ssl_certificates.htm

    https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https
    https://superuser.com/questions/1129221/openssl-req-new-with-some-default-subj-values
    """
    key = "ssh/private.pem"
    cert = "ssh/public.pem"
    ipaddr = "128.173.236.108" #Remote

    print(f"""openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout {key} -out {cert} -subj "/CN={ipaddr}/emailAddress=frantzme@vt.edu/C=US/ST=VA/L=Blacksburg" """)

    return

def generate():
    for x in [
        "sudo apt-get install -y dos2unix",
        "npm install openapi-typescript-codegen --save-dev",
        "yes|rm -r ./src/common/generated/",
        "npx openapi-typescript-codegen --input ./openapi.json --output ./src/common/generated/ --client axios",
    ]: 
        print(x);os.system(x)

    from fileinput import FileInput as finput

    path,cert,firstRun = "./src/common/generated/core/request.ts","./ssh/public.pem", False
    if os.path.exists(path):
        from pathlib import Path
        run(f"cp {cert} {Path(path).parent.absolute()}")
        with finput(path, inplace=True, backup=None) as lines:
            for line in lines:
                if line.strip() ==  "import FormData from 'form-data';":
                    sub_lines = [
                        "import * as FormData from 'form-data';\n",
                        "import { logAxiosRequestConfig } from '../../log/logging';\n"
                    ]
                    firstRun = True
                elif line.strip() == "import type { OpenAPIConfig } from './OpenAPI';":
                    # https://giacomo-mariani.medium.com/adding-trusted-ca-to-node-client-with-axios-2792024bca4
                    sub_lines = [
                        "import type { OpenAPIConfig } from './OpenAPI';\n",
                        "const https = require('https');\n",
                        "const fs = require('fs');\n",
                        "let caCrt = '';\n",
                        "try {\n",
                        "caCrt = fs.readFileSync('./public.pem');\n",
                        "} catch(err) {}\n",
                        "const httpsAgent = new https.Agent({ ca: caCrt, keepAlive: false, rejectUnauthorized: false });\n"
                    ]
                elif line.strip() == "withCredentials: config.WITH_CREDENTIALS,":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}withCredentials: config.WITH_CREDENTIALS,\n"
                        f"{frontspace}httpsAgent: httpsAgent,\n"
                    ]
                elif firstRun and line.strip() == "onCancel(() => source.cancel('The user aborted a request.'));":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}onCancel(() => source.cancel('The user aborted a request.'));\n",
                        f"{frontspace}logAxiosRequestConfig(requestConfig);\n"
                    ]
                else:
                    sub_lines = [line]

                for sub_line in sub_lines:
                    print(sub_line, end='')
        path = "./src/common/generated/core/OpenAPI.ts"
        with finput(path, inplace=True, backup=None) as lines:
            for line in lines:
                sub_lines = []
                if line.strip() == "BASE: 'http://127.0.0.1:5000',\n":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}BASE: 'https://127.0.0.1:5000',\n"
                    ]
                else:
                    sub_lines = [line]
                for sub_line in sub_lines:
                    print(sub_line, end='')

    run("find ./src/ -type f -exec dos2unix {} \;")

def changeTLS():
    from fileinput import FileInput as finput
    path,cert = "./src/common/generated/core/request.ts","./ssh/public.pem"
    if os.path.exists(path):
        from pathlib import Path
        run(f"cp {cert} {Path(path).parent.absolute()}")
        prepped = False
        with finput(path, inplace=True, backup=None) as lines:
            for line in lines:
                if line.strip() ==  "import FormData from 'form-data';":
                    sub_lines = ["import * as FormData from 'form-data';\n"]
                elif line.strip() ==  "import * as FormData from 'form-data';":
                    prepped = True
                    sub_lines = ["import * as FormData from 'form-data';\n"]
                elif not prepped and line.strip() == "import type { OpenAPIConfig } from './OpenAPI';":
                    # https://giacomo-mariani.medium.com/adding-trusted-ca-to-node-client-with-axios-2792024bca4
                    sub_lines = [
                        "import type { OpenAPIConfig } from './OpenAPI';\n",
                        "const https = require('https');\n",
                        "const fs = require('fs');\n",
                        "let caCrt = '';\n",
                        "try {\n",
                        "caCrt = fs.readFileSync('./public.pem');\n",
                        "} catch(err) {}\n",
                        "const httpsAgent = new https.Agent({ ca: caCrt, keepAlive: false, rejectUnauthorized: false });\n"
                    ]
                elif not prepped and line.strip() == "withCredentials: config.WITH_CREDENTIALS,":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}withCredentials: config.WITH_CREDENTIALS,\n"
                        f"{frontspace}httpsAgent: httpsAgent,\n"
                    ]
                elif line.strip() == "httpsAgent: httpsAgent,":
                    sub_lines = []
                else:
                    sub_lines = [line]

                for sub_line in sub_lines:
                    print(sub_line, end='')

        path = "./src/common/generated/core/OpenAPI.ts"
        with finput(path, inplace=True, backup=None) as lines:
            for line in lines:
                sub_lines = []
                if line.strip() == "BASE: 'http://127.0.0.1:5000',":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}BASE: 'https://127.0.0.1:5000',\n"
                    ]
                elif line.strip() == "BASE: 'https://127.0.0.1:5000',":
                    frontspace = line.replace(line.strip()+"\n",'')
                    sub_lines = [
                        f"{frontspace}BASE: 'http://127.0.0.1:5000',\n"
                    ]
                else:
                    sub_lines = [line]
                for sub_line in sub_lines:
                    print(sub_line, end='')

def recording():
    for x in [
        "sudo apt-get update",
        "sudo apt-get install -y scrot imagemagick xdotool",
        "mkdir /tmp/xsrPrep/",
        "wget https://github.com/nonnymoose/xsr/releases/download/v1.0.0/xsr.tar.gz -O /tmp/xsrPrep/xsr.tar.gz",
        "cd /tmp/xsrPrep/ && tar xf xsr.tar.gz && sudo mv usr/bin/xsr /bin/xsr && mkdir -p /usr/share/xsr && sudo cp /tmp/xsrPrep/usr/share/xsr/Cursor.png /usr/share/xsr"

    ]:
        run(x)


def pub():
    for x in [
        "npm install -g @vscode/vsce",
        "vsce package"
    ]:
        run(x)

def getArgs():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", help="Start the docker environment",action='store_true',default=False)
    parser.add_argument("--preppy", help="Create the preped python file",action='store_true',default=False)
    parser.add_argument("--pub", help="Create the zip published file",action='store_true',default=False)
    parser.add_argument("--prep", help="Prepare the JS/NodeJS stuff",action='store_true',default=False)
    parser.add_argument("--ini", help="Run the initialization script",action='store_true',default=False)
    parser.add_argument("--generate", help="Re-Generate the openapi-relevant TypeScript Files from the openapi.json file",action='store_true',default=False)
    parser.add_argument("--full", help="Run the --ini and the --prep",action='store_true',default=False)
    parser.add_argument("--cert", help="Generate the instructions for the cert",action='store_true',default=False)
    parser.add_argument("--tls", help="Flip the secure insecure settings",action='store_true',default=False)
    parser.add_argument("--code", help="Install the vs code extensions",action='store_true',default=False)
    parser.add_argument("--recording", help="Install the Recording equipment",action='store_true',default=False)
    
    return parser.parse_args()

if __name__ == "__main__":
    argz = getArgs()

    if argz.env:
        env()
    elif argz.pub:
        pub()
    elif argz.preppy:
        preppy()
    elif argz.prep:
        prep()
    elif argz.ini:
        ini()
    elif argz.generate:
        generate()
    elif argz.full:
        run("yes|rm -r dist/")
        vsExtensions()
        ini()
        prep()
    elif argz.cert:
        generate_cert()
    elif argz.tls:
        changeTLS()
    elif argz.code:
        vsExtensions()
    elif argz.recording:
        recording()
