const Together = require("together-ai");
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

const InvoiceSchema = z.object({
    customer: z.object({
        name: z.string(),
        email: z.string(),
        shippingAddress: z.string(),
        billingAddress: z.string()
    }),
    items: z.array(z.object({
        name: z.string(),
        rate: z.number(),
        quantity: z.number()
    })),
    total_payable_amount: z.number()
});

const schema = zodToJsonSchema(InvoiceSchema, 'Invoice');

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// const schema = {
//     customer: {
//         name: "string",
//         email: "string",
//         shippingAddress: "string",
//         billingAddress: "string"
//     },
//     items: [
//         {
//             name: "string",
//             price: "number",
//             quantity: "number"
//         }
//     ]
// };

const generateContent = async (invoice) => {


    // return invoice;

    try {
        const extract = await together.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "The following is an invoice. Only answer in JSON"
                },
                {
                    role: "user",
                    content: invoice
                }
            ],

            model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            response_format: {
                type: "json_object",
                schema: schema
            }

        });

        if (extract?.choices?.[0]?.message?.content) {
            const output = JSON.parse(extract?.choices?.[0]?.message?.content);
            console.log(output);
            return output;
        } else {
            return { error: "No response from model" };
        }

    }

    catch (error) {
        console.error(error);
    }
};

module.exports = { generateContent };