import Mock from 'mockjs';
import { vapis ,operate ,vapisearch ,vapi } from './api'
import { save as projectSave ,list as projectList ,Detail as projectDetail } from './project'
import { list as variedList } from './varied'


// Mock.setup({
//     timeout: 3000
// })

Mock.mock(RegExp('/api/vapi/list?' + ".*"), vapis); // ...
Mock.mock(RegExp('/api/vapi/search?' + ".*"), vapisearch);
Mock.mock(RegExp('/api/vapi/create?' + ".*"),operate);  // ...
Mock.mock(RegExp('/api/vapi/delete?' + ".*"),operate); // ...
Mock.mock(RegExp('/api/vapi/detail?' + ".*"),vapi);


Mock.mock(RegExp('/api/project/detail?' + ".*"),projectDetail);
Mock.mock(RegExp('/api/project/create?' + ".*"),projectSave); // ...
Mock.mock(RegExp('/api/project/delete?' + ".*"),projectSave); // ...
Mock.mock(RegExp('/api/project/list?' + ".*"),projectList); // ...
Mock.mock(RegExp('/api/project/search?' + ".*"), projectList);
Mock.mock(RegExp('/api/project/vapi/list?' + ".*"),vapis);    
Mock.mock(RegExp('/api/project/vapi/search?' + ".*"),vapis);    
Mock.mock(RegExp('/api/project/savetree?' + ".*"),operate);



Mock.mock(RegExp('/api/varied/vapi/list?' + ".*"),variedList);
Mock.mock(RegExp('/api/varied/upreq?' + ".*"),operate);
Mock.mock(RegExp('/api/varied/upres?' + ".*"),operate);
Mock.mock(RegExp('/api/varied/delete?' + ".*"),operate);




