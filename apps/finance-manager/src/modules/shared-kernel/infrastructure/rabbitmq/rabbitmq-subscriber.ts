import { AmqpConnection, Nack } from "@golevelup/nestjs-rabbitmq";
import { Inject, Injectable } from "@nestjs/common";
import { IEvent, IMessageSource } from "@nestjs/cqrs";
import { Subject } from "rxjs";

// TODO: Import AmqpConnection and Nack from @golevelup/nestjs-rabbitmq

@Injectable()
export class RabbitMQSubscriber implements IMessageSource {
    private bridge: Subject<any>;

    constructor(
        // TODO: Inject AmqpConnection
        private readonly amqpConnection: AmqpConnection,
        @Inject("EVENTS")
        private readonly events: Array<object & { name: string }>,
    ) {}

    connect() {
        // TODO: For each event in this.events
        // 1. Create a subscriber with amqpConnection.createSubscriber
        // 2. Parse the message and create a new event instance
        // 3. Send the event to the bridge (this.bridge.next)
        // 4. Return a Nack to acknowledge the message
        this.events.forEach(async (event) => {
            await this.amqpConnection.createSubscriber<string>(
                async (message: string | undefined) => {
                    if (this.bridge && message) {
                        const parsedJson = JSON.parse(message);
                        const receivedEvent = new (event as any)(parsedJson);
                        this.bridge.next(receivedEvent);
                    }
                    return new Nack(false);
                },
                {
                    errorHandler: (channel, msg, e) => {
                        throw e;
                    },
                    queue: event.name,
                },
                `handler_${event.name}`,
            );
        });
        console.log("[TODO] Connecting RabbitMQ subscriber");
        console.log(
            "Events to subscribe:",
            this.events.map((e) => e.name),
        );
    }

    bridgeEventsTo<T extends IEvent>(_subject: Subject<T>) {
        // This method bridges the RabbitMQ messages to the NestJS event bus
        this.bridge = _subject;
    }
}
