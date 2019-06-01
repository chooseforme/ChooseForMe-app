import React from "react";
import { Image, View, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { setLoggingIn } from "../redux/app-redux";
import { Header, Container, Content, Text, Button, List } from "native-base";
import HomeHeader from "../components/common/HomeHeader";
import PollCard from "../components/poll/pollcard";
const mapStateToProps = state => {
  return {
    loggingIn: state.loggingIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggingIn: logging => {
      dispatch(setLoggingIn(logging));
    }
  };
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggingIn: false };
  }

  componentDidMount() {
    this.props.setLoggingIn(false);
  }

  render() {
    return (
      <Container>
        <HomeHeader navigation={this.props.navigation} />
        <Content>
          <List style={{ flex: 0 }}>
            <PollCard
              author="ioioio8888"
              createdAt="12/1/2019"
              question="Where is my wallet?"
              options={[
                { key: 1, word: "home" },
                { key: 2, word: "school" },
                { key: 3, word: "idk go find it yourself ssssssssssssss" }
              ]}
              summary="I am so sad... I want my money back"
            />
            {/* <PollCard
              author="Louis Lui"
              createdAt="1/1/2019"
              question="How to 打打打 "
              options={[
                { key: 1, word: "打屎忽" },
                { key: 2, word: "打patpat" },
                { key: 3, word: "打打打" }
              ]}
              summary="查良鏞，GBM ，OBE（英語：Louis Cha Jing-yong[2][註 1]，1924年3月10日[4]－2018年10月30日[5]），男，筆名金庸，浙江海寧人，武俠小說泰斗，1948年移居香港。自1950年代起，其以筆名「金庸」創作多部膾炙人口的武俠小說，包括《射鵰英雄傳》、《神鵰俠侶》、《倚天屠龍記》、《天龍八部》、《笑傲江湖》、《鹿鼎記》等。歷年來金庸筆下的著作屢次改編為電視劇、電影等影視作品，對華人影視文化可謂貢獻重大。這亦奠定其成為華人知名作家的基礎，素有「有華人的地方，就有金庸的武俠」的稱讚。金庸早年於香港創辦《明報》系列報刊，並在1980年代涉足政界，曾任香港基本法起草委員會委員[6][7]。他因其優秀的小說作品而被稱為「香港四大才子」之一[8]，後與古龍、梁羽生合稱為「中國武俠小說三劍客」。於2018年10月30日下午因病於香港養和醫院逝世，享年94歲[9]。"
            /> */}
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
