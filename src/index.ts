import Fastify from 'fastify'
import 'dotenv/config'

import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

const app = Fastify({
  logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Bootcamp Treinos API',
        description: 'API de treinos para o bootcamp FSC',
        version: '1.0.0',
      },
      servers: [{
        description: 'Localhost',
        url: 'http://localhost:3000',
      }],
    },
    transform: jsonSchemaTransform,
  
  });
  
  await app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
  });

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