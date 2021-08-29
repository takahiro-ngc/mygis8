import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import { TransitionGroup } from "react-transition-group";
import { List as ListReactMovable, arrayMove } from "react-movable";
import Title from "./Title";
import SelectedLayerItem from "./SelectedLayerItem";

export default function SelectedLayerList({
  deleteLayer,
  layers,
  setLayers,
  storedHistry,
  addLayer,
  setHistry,
}) {
  return (
    <div
      style={{
        overflowY: "scroll", //常にスクロールバーの幅が確保されることで，バーの有無でwidthが変わるのを防ぐ
        height: "100%",
      }}
    >
      <Title
        layers={layers}
        addLayer={addLayer}
        storedHistry={storedHistry}
        setHistry={setHistry}
      />

      <ListReactMovable
        values={layers}
        onChange={({ oldIndex, newIndex }) =>
          setLayers(arrayMove(layers, oldIndex, newIndex))
        }
        renderList={({ children, props, isDragged }) => (
          <List
            {...props}
            style={{
              boxShadow: isDragged && "inset 0px 0px 8px white",
            }}
            disablePadding
          >
            {/* component={null}がないとドラッグが正常に動かない */}
            <TransitionGroup component={null}>{children}</TransitionGroup>
          </List>
        )}
        renderItem={({ value, props, index, isDragged, isSelected }) => (
          <Collapse key={value.id} in={true} timeout={300}>
            <SelectedLayerItem
              value={value}
              props={props}
              index={index}
              isDragged={isDragged}
              isSelected={isSelected}
              deleteLayer={deleteLayer}
              layers={layers}
              setLayers={setLayers}
              storedHistry={storedHistry}
              addLayer={addLayer}
              setHistry={setHistry}
            />
          </Collapse>
        )}
      />
    </div>
  );
}
