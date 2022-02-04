import { Icon, Layout } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

const StarIcon = (props) => (
  <Icon {...props} style={{ width: 15, height: 15 }} name="star" />
);
const StarGroup = (props) => {
  const chk = [0, 0, 0, 0, 0];
  return (
    <Layout style={{ flexDirection: "row" }}>
      {chk.map((_, index) => {
        return (
          <StarIcon
            key={index}
            fill={index < props.rate ? theme["color-primary-500"] : "gray"}
          />
        );
      })}
    </Layout>
  );
};

export default StarGroup;
