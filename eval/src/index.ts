import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "eval",
    version: "0.1.1",
    capabilities: {
        resources: {},
        tools: {
            add: {
                name: "add",
                description: "输入两个数字，计算他们的和",
                parameters: {
                    a: z.number().describe("第一个数字"),
                    b: z.number().describe("第二个数字"),
                },
            },
            Minus: {
                name: "minus",
                description: "输入两个数字，计算他们的差",
                parameters: {
                    a: z.number().describe("被减数"),
                    b: z.number().describe("减数"),
                },
            },
            Multiply: {
                name: "multiply",
                description: "输入两个数字，计算他们的积",
                parameters: {
                    a: z.number().describe("第一个数字"),
                    b: z.number().describe("第二个数字"),
                },
            },
            Divide1: {
                name: "divide1",
                description: "输入两个数，计算它们的商(小数)",
                parameters: {
                    a: z.number().describe("被除数"),
                    b: z.number().describe("除数"),
                },
            },
            Divide2: {
                name: "divide2",
                description: "输入两个数，计算它们的商(取余数)。",
                parameters: {
                    a: z.number().describe("被除数"),
                    b: z.number().describe("除数"),
                },
            },
            pow: {
                name: "pow",
                description: "输入底数和指数，计算他们的幂",
                parameters: {
                    a: z.number().describe("底数"),
                    b: z.number().describe("指数"),
                },
            },
            Sqrt: {
                name: "Sqrt",
                description: "输入一个数字，计算他的平方根",
                parameters: {
                    a: z.number().describe("要开方的数"),
                },
            },
            jc: {
                name: "阶乘",
                description: "输入一个数字，计算他的阶乘",
                parameters: {
                    a: z.number().describe("要阶乘的数"),
                },
            }
        },
    },
});

async function add(a: number, b: number) {
    return a + b;
}
async function minus(a: number, b: number) {
    return a - b;
}
async function multiply(a: number, b: number) {
    return a * b;
}
async function divide1(a: number, b: number) {
    if(b===0){
        return "除数不能为0";
    }
    return a / b;
}
async function divide2(a: number, b : number){
    if(b===0){
        return "除数不能为0";
    }
    const r=a%b;
    const v=Math.floor(a/b);
    return [v,r];
}
async function pow(a: number, b : number){
    return a ** b;
}
async function Sqrt(a: number){
    return a**0.5;
}
async function jc(a: number){
    let res = 1;
    for(let i = a;i > 0; i--){
        res=res*i;
    }
    return res;
}
server.tool(
    "计算加法的工具",
    "输入两个数，计算它们的和",
    {
        a: z.number().describe("第一个数字"),
        b: z.number().describe("第二个数字"),
    },
    {purpose:"输入两个数，计算它们的和"},
    async ({a,b}) => {
        const res=await add(a,b);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);

server.tool(
    "计算减法的工具",
    "输入两个数，计算它们的差",
    {
        a: z.number().describe("被减数"),
        b: z.number().describe("减数"),
    },
    {purpose:"输入两个数，计算它们的差"},
    async ({a,b}) => {
        const res=await minus(a,b);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);
server.tool(
    "计算乘法法的工具",
    "输入两个数，计算它们的积",
    {
        a: z.number().describe("第一个数字"),
        b: z.number().describe("第二个数字"),
    },
    {purpose:"输入两个数，计算它们的积"},
    async ({a,b}) => {
        const res=await multiply(a,b);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);
server.tool(
    "计算除法的工具(小数)",
    "输入两个数，计算它们的商(小数)",
    {
        a: z.number().describe("被除数"),
        b: z.number().describe("除数"),
    },
    {purpose:"输入两个数，计算它们的商(小数)"},
    async ({a,b}) => {
        const res=await divide1(a,b);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);
server.tool(
    "计算除法的工具(商和余数)",
    "输入两个数，计算它们的商(取余数)。",
    {
        a: z.number().describe("被除数"),
        b: z.number().describe("除数"),
    },
    {purpose:"输入两个数，计算它们的商(取余数)。"},
    async ({a,b}) => {
        const res=await divide2(a,b);
        const [v,r]=res;
        return {
            content:[
                {
                    type:"text",
                    text:`商为${v}，余数为${r}`,
                }
            ]
        };
    }
);
server.tool(
    "计算平方根的工具",
    "输入一个数，计算它的平方根",
    {
        a: z.number().describe("第一个数字"),
    },
    {purpose:"输入一个数，计算它的平方根"},
    async ({a}) => {
        const res=await Sqrt(a);   
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);
server.tool(
    "计算幂次方的工具",
    "输入底数和指数，计算它们的幂次方",
    {
        a: z.number().describe("底数"),
        b: z.number().describe("指数"),
    },
    {purpose:"输入底数和指数，计算它们的幂次方"},
    async ({a,b}) => {
        const res=await pow(a,b);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
);
server.tool(
    "计算阶乘的工具",
    "输入一个数，计算它的阶乘",
    {
        a: z.number().describe("要取阶乘的数"),
    },
    {purpose: "输入一个数，计算它的阶乘"},
    async ({a}) => {
        const res=await jc(a);
        return {
            content:[
                {
                    type:"text",
                    text:String(res),
                }
            ]
        };
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Eval MCP Server running on stdio");
  }
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
