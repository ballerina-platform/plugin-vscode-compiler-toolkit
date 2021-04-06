/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
 import * as path from 'path';
 import { runTests } from './lib/index';
 
 async function go() {
     try {
         const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
         const extensionTestsPath = path.resolve(__dirname, '.');
 
         await runTests({
             extensionDevelopmentPath,
             extensionTestsPath
         });
     } catch (err) {
         process.exit(1);
     }
 }
 
 go();
 