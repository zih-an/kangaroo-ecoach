import React from "react";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;

const PlanIcon = (props) => <Icon {...props} name="book-open-outline" />;

const ShoppingIcon = (props) => (
  <Icon {...props} name="shopping-cart-outline" />
);

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

export default function AppNavigator() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <BottomNavigation
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      <BottomNavigationTab icon={HomeIcon} title="主页" />
      <BottomNavigationTab icon={PlanIcon} title="计划" />
      <BottomNavigationTab icon={ShoppingIcon} title="商城" />
      <BottomNavigationTab icon={PersonIcon} title="我的" />
    </BottomNavigation>
  );
}
