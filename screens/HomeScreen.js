import React from "react";
import { Image, View, ActivityIndicator, FlatList } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn, watchPublicPolls } from "../redux/app-redux";
import { Header, Container, Content, Text, Button, List } from "native-base";
import HomeHeader from "../components/common/HomeHeader";
import PollCard from "../components/poll/pollcard";


const mapStateToProps = state => {
  return {
    loggingIn: state.loggingIn,
    publicPolls: state.publicPolls,
    refreshingPublicPolls: state.refreshingPublicPolls,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggingIn: logging => {
      dispatch(setLoggingIn(logging));
    },
    watchPublicPolls: () => {
      dispatch(watchPublicPolls());
    }
  };
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      pollsdata: [],
      isRefreshing: false,
    };
    this.props.watchPublicPolls();
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  _renderRow = poll => {
    //console.log(poll.item)
    return (
      <PollCard
        poll={poll.item}
      />
    );
  };

  render() {
    if (this.props.refreshingPublicPolls) {
      return (
        <Container>
          <HomeHeader navigation={this.props.navigation} />
            <ActivityIndicator size="large"/>
        </Container>
      )
    }

    return (
      <Container>
        <HomeHeader navigation={this.props.navigation} />
          <FlatList
            data={this.props.publicPolls}
            renderItem={this._renderRow}
            refreshing={this.props.refreshingPublicPolls}
            onRefresh={()=>{
              this.props.watchPublicPolls();
            }}
            keyExtractor={item => item.id.toString()}
            extraData={this.state}
          />
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
