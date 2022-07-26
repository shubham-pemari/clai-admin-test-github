import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
    AutoForm, ErrorsField, SubmitField, TextField,
} from 'uniforms-semantic';
import { wrapMeteorCallback } from '../utils/Errors';
import { GlobalSettings } from '../../../api/globalSettings/globalSettings.collection';

class LoginComponent extends React.Component {
    loginFormSchema = new SimpleSchema(
        {
            email: {
                type: String,
                regEx: SimpleSchema.RegEx.EmailWithTLD,
            },
            password: { type: String },
        },
        { tracker: Tracker },
    );


    loginFormSchemaBridge = new SimpleSchema2Bridge(this.loginFormSchema)

    constructor(props) {
        super(props);
       
        Meteor.call('users.checkEmpty', wrapMeteorCallback((err, res) => {
            if (res) {
                browserHistory.push('/setup/welcome');
            }
        }));
            
       
        this.state = {
            loggingIn: false,
            loggedOut: !Meteor.userId
        };
    }

    componentDidMount() {
        Meteor.logout(() => this.setState({ loggedOut: true }));
    }

    handleLogin = (loginObject) => {
        this.setState({ loggingIn: true });
        const { email, password } = loginObject;
        Meteor.loginWithPassword(
            { email: email.trim().toLowerCase() },
            password,
            wrapMeteorCallback((err) => {
                if (!err) {
                    const { location } = this.props;
                    // this represents the previously visited page on our domain.
                    if (location?.state?.nextPathname && location?.state?.nextPathname.indexOf('login') === -1) {
                        // if it exists we want to go back to the page the user was trying to visit
                        browserHistory.goBack();
                    } else {
                        // if not, we use the default route
                        browserHistory.push('/');
                    }
                }
            }),
        );
    };

    render() {
        const { loggingIn, loggedOut } = this.state;
        return (
            <>
                {loggedOut && (
                    <Segment className='account-block'>
                        <AutoForm model={{}} schema={this.loginFormSchemaBridge} onSubmit={this.handleLogin} className='ui large account-form' disabled={loggingIn}>
                            <ErrorsField />
                            <TextField name='email' iconLeft='user' placeholder='Email' type='email' label={null} data-cy='login-field' />
                            <TextField name='password' iconLeft='lock' placeholder='Password' type='password' label={null} data-cy='password-field' />
                            <SubmitField value='LOGIN' className='black large basic fluid' data-cy='login-button' />
                            <br />
                            <Link style={{ color: '#000' }} to='/forgot-password'>
                                Forgot your password?
                            </Link>
                        </AutoForm>
                    </Segment>
                )}
            </>
        );
    }
}

LoginComponent.propTypes = {
    route: PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
    }).isRequired,
    settings: PropTypes.object,
    location: PropTypes.object,
};

LoginComponent.defaultProps = {
    settings: {},
    location: {},
};

const LoginContainer = withTracker(() => {
    Meteor.subscribe('settings');
    const settings = GlobalSettings.findOne({}, { fields: { 'settings.public.reCatpchaSiteKey': 1 } });
    return {
        settings,
    };
})(LoginComponent);
export default LoginContainer;
