import { environment } from "./environment";
import { clientConfigProd } from "./OPCUaClientConfigProd";
import { clientConfigTest } from "./OPCUaClientConfigTest";
import { runJob } from "./util/RunCronjob";
console.log(`Service started at ${new Date()} in ${environment.env} environment`);

if(environment.env == "test")        runJob("1 * * * * *",clientConfigTest)
if(environment.env == "production")  runJob("59 * * * * *",clientConfigProd)
