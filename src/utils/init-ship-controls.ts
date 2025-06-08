import type { GameObject } from "../classes/game-object";
import { MovementComponent } from "../classes/movement-component";
import { PlayerInputComponent } from "../classes/player-input-component";
import type { Rectangle } from "../classes/rectangle";
import { RollComponent } from "../classes/roll-component";
import { getFrustrumBounds } from "./get-frustrum-bounds";

export function initShipControls(
	shipObject: GameObject,
	canvasElement: HTMLCanvasElement,
	shipBounds: Rectangle,
) {
	const constraints = getFrustrumBounds();

	constraints.left += shipBounds.width / 2;
	constraints.right -= shipBounds.width / 2;
	constraints.top -= shipBounds.height / 2;
	constraints.bottom += shipBounds.height / 2;

	const playerMovementComponent = new MovementComponent({
		constraints: constraints,
	});

	const playerInputComponent = new PlayerInputComponent(
		playerMovementComponent,
		canvasElement,
	);
	const rollComponent = new RollComponent();

	shipObject.addComponent(playerMovementComponent);
	shipObject.addComponent(playerInputComponent);
	shipObject.addComponent(rollComponent);
}
