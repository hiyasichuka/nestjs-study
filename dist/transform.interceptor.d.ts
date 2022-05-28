import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): import("rxjs").Observable<Record<string, any>>;
}
