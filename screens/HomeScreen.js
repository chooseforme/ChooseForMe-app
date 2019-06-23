import React from "react";
import { Image, View, ActivityIndicator, FlatList } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn, refreshPublicPolls, loadPublicPolls } from "../redux/app-redux";
import { Header, Container, Content, Text, Button, List } from "native-base";
import HomeHeader from "../components/common/HomeHeader";
import PollCard from "../components/poll/pollcard";


const mapStateToProps = state => {
  return {
    loggingIn: state.loggingIn,
    publicPolls: state.publicPolls,
    loadingPublicPolls: state.loadingPublicPolls,
    refreshingPublicPolls: state.refreshingPublicPolls,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggingIn: logging => {
      dispatch(setLoggingIn(logging));
    },
    refreshPublicPolls: () => {
      dispatch(refreshPublicPolls());
    },
    loadPublicPolls:()  =>{
      dispatch(loadPublicPolls());
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
    this.props.refreshPublicPolls();
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
              this.props.refreshPublicPolls();
            }}
            loading={this.props.loadingPublicPolls}
            onEndReached={()=>{
            this.props.loadPublicPolls()}
          }
            onEndReachedThreshold={0.1}
            keyExtractor={item => item.id.toString()}
            extraData={this.props.poll}
          />
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
