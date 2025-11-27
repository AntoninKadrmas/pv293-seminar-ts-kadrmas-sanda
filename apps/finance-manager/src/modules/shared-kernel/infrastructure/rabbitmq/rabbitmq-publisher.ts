import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { IEventPublisher } from "@nestjs/cqrs";

// TODO: Import AmqpConnection from @golevelup/nestjs-rabbitmq

@Injectable()
export class RabbitMQPublisher implements IEventPublisher {
    // TODO: Inject AmqpConnection in the constructor
    constructor(private readonly amqpConnection: AmqpConnection) {}

    connect(): void {
        // This method is required by the IEventPublisher interface
        // It's called when the publisher is registered with the EventBus
    }

    publish<T>(event: T & { constructor: { name: string } }): void {
        // TODO: Implement publishing logic
        // 1. Use amqpConnection.publish method
        // 2. Use an empty string "" for the exchange (default exchange)
        // 3. Use event.constructor.name as the routing key
        // 4. Serialize the event to JSON
        this.amqpConnection.publish("", event.constructor.name, JSON.stringify(event));
        // For now, just log the event to the console
        console.log(`[TODO] Publishing event: ${JSON.stringify(event)}`);
    }
}
