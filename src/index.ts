import Fastify from 'fastify'
import 'dotenv/config'

import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

const app = Fastify({
  logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Declare a route
app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
        description: 'API de treinos',
        tags: ['treinos'],
        response: {
            200: z.object({
                message: z.string()
            })
        }
    },
    handler: () =>{
        return { message: 'Hello World' }
    }
  });



try{
    await app.listen({ port: Number(process.env.PORT) })
    app.log.info(`Server is running`)
}catch(err){
    app.log.error(err)
    process.exit(1)
}