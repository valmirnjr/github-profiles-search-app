import React from "react";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import PropTypes from "prop-types";

import { View } from "./styles";

const loadingView = () => (
  <View>
    <ActivityIndicator color="#7159c1" size="large" justifyContent="center" />
  </View>
);

export default function Repository({ navigation }) {
  const repo = navigation.getParam("repo");

  return (
    <WebView
      source={{ uri: repo.html_url }}
      style={{ flex: 1 }}
      startInLoadingState
      renderLoading={loadingView}
    />
  );
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("repo").name,
});
