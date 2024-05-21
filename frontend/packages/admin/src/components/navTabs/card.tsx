import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useOutlet } from "react-router-dom";
import { AppHelper, useFlat } from "src/service";

export const ItemTypes = {
	CARD: "card",
};

export interface CardProps {
	id: string;
	text: string;
	index: number;
	moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
	index: number;
	id: string;
	type: string;
}

const Card = ({
	id,
	index,
	moveCard,
	children,
}: React.PropsWithChildren<CardProps>) => {
	const { tabItems } = useFlat("appStore");
	const { routesMap } = useFlat("routerStore");
	const outlet = useOutlet();
	const ref = useRef<HTMLDivElement>(null);
	const [{ handlerId }, drop] = useDrop<
		DragItem,
		void,
		{ handlerId: any | null }
	>({
		accept: ItemTypes.CARD,

		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}
			const clientOffset = monitor.getClientOffset();
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// ref.current.style.display = "none";
			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return;
			}
			// Determine rectangle on screen

			// Get vertical middle
			const hoverMiddleX =
				(hoverBoundingRect.right - hoverBoundingRect.left) / 2;

			// Determine mouse position

			// Get pixels to the top
			const hoverClientX =
				(clientOffset as any).x - hoverBoundingRect.left;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
				return;
			}
			// Time to actually perform the action
			moveCard(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});

	const [_, drag] = useDrag({
		type: ItemTypes.CARD,
		item: () => {
			return { id, index };
		},
		end(item, monitor) {
			const clientOffset = monitor.getClientOffset();
			const hoverBoundingRect = ref.current?.getBoundingClientRect();
			if (
				tabItems.length > 1 &&
				hoverBoundingRect!.y - clientOffset!?.y < 30
			) {
				if (
					!routesMap.HelloPage.path!.includes(
						id.split("/").slice(-1)[0],
					)
				) {
					AppHelper.addWinbox({
						content: outlet,
						pos: clientOffset as { x: number; y: number },
						title: id,
					});
					AppHelper.closeTabByPath({
						pathName: item.id,
					});
				}
			}
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));
	return (
		<div
			style={{
				marginRight: "4px",
			}}
			ref={ref}
			data-handler-id={handlerId}
		>
			{children}
		</div>
	);
};

export default Card;
