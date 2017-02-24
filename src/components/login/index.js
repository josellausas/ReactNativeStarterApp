
'use strict';

import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import { replaceRoute } from '../../actions/route';
import { setUser } from '../../actions/user';
import { Container, Content, InputGroup, Input, Button, Icon, View } from 'native-base';

import myTheme from '../../themes/base-theme';
import styles from './styles';

import Parse from 'parse/react-native';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visibleHeight: Dimensions.get('window').height,
            scroll: false,
            name: '',
            username: '',
            password: '',
            errorMessage: null
        };
    }

    componentDidMount() {
        // Check for cached user
        Parse.User.currentAsync()
            .then((currentUser)=>{
                if (currentUser) {
                    this.replaceRoute('home')
                } 
            }
        );
    }

    replaceRoute(route) {
        this.setUser(this.state.name);
        this.props.replaceRoute(route);
    }

    setUser(name) {
        this.props.setUser(name);
    }

    attemptLogin() {
        Parse.User.currentAsync()
            .then((currentUser)=>{
                if (currentUser) {
                    this.replaceRoute('home')
                } else {
                    Parse.User.logIn(this.state.username, this.state.password, {
                        success: (user) => {
                            // React to good login here
                            this.replaceRoute('home')
                        },
                        error: (data, error) => {
                            console.log(data, error);
                            this.setState({errorMessage: error.message});
                        }
                    })
                }
            }
        );


        
    }

    render() {

        return (
            <Container theme={myTheme}>
                <View style={styles.container}>
                    <Content>
                        <Image source={require('../../../images/shadow.png')} style={styles.shadow}>
                            <View style={styles.bg}>
                                <InputGroup style={styles.input}>
                                    <Icon name='ios-person' />
                                    <Input placeholder='Username' onChangeText={(username) => this.setState({username})} />
                                </InputGroup>
                                <InputGroup style={styles.input}>
                                    <Icon name='ios-unlock-outline' />
                                    <Input
                                        placeholder='Password'
                                        secureTextEntry={true}
                                        onChangeText={(password) => this.setState({password})} 
                                    />
                                </InputGroup>
                                <Button style={styles.btn} textStyle={{color: '#fff'}} onPress={ this.attemptLogin }>
                                    Login
                                </Button>
                            </View>
                        </Image>
                    </Content>
                </View>
            </Container>
        )
    }
}

function bindActions(dispatch){
    return {
        replaceRoute:(route)=>dispatch(replaceRoute(route)),
        setUser:(name)=>dispatch(setUser(name))
    }
}

export default connect(null, bindActions)(Login);
