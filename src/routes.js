import { createAppContainer, createStackNavigator } from "react-navigation";

import Main from "./pages/Main/index";
import User from "./pages/User/index";
import Repo from "./pages/Repository/index";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Repo,
    },
    {
      headerLayoutPreset: "center",
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: "#7159c1",
        },
        headerTintColor: "#fff",
      },
    }
  )
);

export default Routes;
