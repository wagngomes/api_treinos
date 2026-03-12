import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { ErrorSchema, WorkoutPlanSchema } from "../schemas/index.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { CreateWorkoutPlan } from "../useCases/createWorkoutPlan.js";

export const workoutPlanRoutes = async (app: FastifyInstance) => {

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: '/',
        schema: {
          body: WorkoutPlanSchema.omit({id: true}),
          response: {
            201:WorkoutPlanSchema,
            400: ErrorSchema,
            401: ErrorSchema,
      
            500: ErrorSchema
          }
        },
        handler: async (request, reply) => {
      
          try{
            const session = await auth.api.getSession({
              headers: fromNodeHeaders(request.headers)
            })
        
            if(!session) {
              return reply.status(401).send({
                error: "Unauthorized",
                code: "UNAUTHORIZED"
        
              })
            }
        
            const createWorkoutPlan = new CreateWorkoutPlan()
            const result =  await createWorkoutPlan.execute({
              userId: session.user.id,
              name: request.body.name,
              workoutDays: request.body.workoutDays
            })
            return reply.status(201).send(result)
      
          }catch(err){
      
            return reply.status(500).send({
              code: 'Internal server error',
              error: 'INTERNAL SERVER ERROR'
      
            })
      
          }     
        }
      })

}