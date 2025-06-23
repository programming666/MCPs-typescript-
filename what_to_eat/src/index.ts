import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const server = new McpServer({
  name: "what_to_eat",
  version: "0.0.1",
  capabilities: {
    resources: {},
    tools: {
      choose_what_to_eat: {
        name: "choose_what_to_eat",
        description: "根据用户的食材列表和人数，推荐用户吃什么",
        parameters: {
          ingredients: z.array(z.string()).describe("用户拥有的食材列表"),
          people: z.number().describe("用餐人数"),
        },
      },
    },
  },
});

interface Recipe {
  name: string;
  ingredients: string[];
  isSoup: boolean;
}

const RECIPE_DB: Recipe[] = [
  { name: '番茄炒蛋', ingredients: ['番茄','鸡蛋'], isSoup: false },
  { name: '罗宋汤', ingredients: ['牛肉','土豆','番茄','洋葱'], isSoup: true },
  { name: '清蒸鱼', ingredients: ['鱼','姜','葱'], isSoup: false },
  { name: '糖醋排骨', ingredients: ['排骨','糖'], isSoup: false },
  { name: '糖醋鱼', ingredients: ['鱼','糖'], isSoup: false },
  { name: '酸辣土豆丝', ingredients: ['土豆','醋','辣椒'], isSoup: false},
  { name: '紫菜蛋花汤', ingredients: ['紫菜','鸡蛋'], isSoup: true},
  { name: '回锅肉', ingredients:['猪肉','辣椒','豆瓣酱'], isSoup: false},
  { name: '凉拌胡萝卜丝', ingredients:['胡萝卜','辣椒'], isSoup: false},
  { name: '白菜豆腐汤', ingredients:['白菜','豆腐'], isSoup: true},
];

async function what_to_eat(userIngredients: Set<string>, people: number): Promise<{ text: string }> {
    if (people < 1) {
        return {text:'人数至少为1'};
    }
    
    const availableFoods = new Set(userIngredients);
    const matchedRecipes = RECIPE_DB.filter(recipe => 
        recipe.ingredients.every(ing => availableFoods.has(ing))
    );
    const soupRecipes = matchedRecipes.filter(r => r.isSoup);
    if (people >= 3 && soupRecipes.length === 0) {
        return {text:'三人及以上需要至少一个汤类菜品（当前无匹配汤品）'};
    }
    const selected: Recipe[] = [];
    let remainingPeople = people;
    
    if (remainingPeople >= 3) {
        const soup = soupRecipes[Math.floor(Math.random() * soupRecipes.length)];
        selected.push(soup);
        remainingPeople--;
    }
    
    const availableRecipes = [...matchedRecipes.filter(r => !selected.includes(r))];
    const tempSelected: Recipe[] = [];
    const available=availableRecipes.length;
    for (let i = 0; i < remainingPeople; i++) {
        if (availableRecipes.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableRecipes.length);
        tempSelected.push(availableRecipes[randomIndex]);
        availableRecipes.splice(randomIndex, 1);
    }
    selected.push(...tempSelected);
    
    if (selected.length > 0) {
        return {text:`为您推荐以下菜品：${selected.map(r => r.name).join('、')}` || ""};
    }
    return {text:`可选用的菜品不足,仅有${available}道菜可选择，选择失败。`};
}


// 修正参数schema为Zod验证方式
server.tool(
  "generate_recipe",
  "根据用户的食材列表和人数，推荐用户吃什么",
  {
    ingredients: z.array(z.string()).describe("用户拥有的食材列表"),
    people: z.number().min(1).describe("用餐人数")
  },
  { purpose: "根据食材和人数推荐食谱" }, 
  async ({ ingredients, people }) => {
    const res=await what_to_eat(new Set(ingredients), people);
    return {
      content:[
        {
          type:'text',
          text:res.text,
        }
      ]
      
    }
  }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("What_to_eat MCP Server running on stdio");
  }
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
