import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import PropTypes from "prop-types";

import api from "../../services/api";

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Body,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from "./styles";

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("user").name,
  });

  state = {
    stars: [],
    loading: false,
    moreRepos: true,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam("user");

    this.setState({ loading: true });

    const response = await api.get(`users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  // Addition of starred repositories when users reach the page end
  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");

    const { stars, page } = this.state;

    const response = await api.get(
      `users/${user.login}/starred?page=${page + 1}`
    );

    // Check if the requisition returned more repos
    if (!Object.keys(response.data).length) {
      this.setState({ moreRepos: false });
    }

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");

    this.setState({ refreshing: true, page: 1 });

    const response = await api.get(`users/${user.login}/starred`);

    this.setState({ stars: response.data, refreshing: false });
  };

  renderRepoDetails = repo => {
    const { navigation } = this.props;
    console.tron.log(repo);
    navigation.navigate("Repo", { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, moreRepos, refreshing } = this.state;

    const user = navigation.getParam("user");

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Body loading={loading}>
          {loading ? (
            <ActivityIndicator color="#7159c1" size="large" />
          ) : (
            <Stars
              onRefresh={this.refreshList} // Triggered when user pulls down the page to refresh
              refreshing={refreshing} // Represents if list is updating
              onEndReachedThreshold={0.2} // The list starts to load more items when the final 20% is reached
              onEndReached={moreRepos && this.loadMore} // Function to load more items
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title onPress={() => this.renderRepoDetails(item)}>
                      {item.name}
                    </Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
        </Body>
      </Container>
    );
  }
}
