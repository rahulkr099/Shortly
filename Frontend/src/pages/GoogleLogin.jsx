// import {useState} from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../api/googleAuth";
import PropTypes from 'prop-types'
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../containers/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleLogin = ({ setIsGoogleAuth }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const responseGoogle = async (authResult) => {
		try {
			console.log('googleLogin ka authresult', authResult)
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				console.log('result in googleLogin:', result);
				const { googleRefreshToken, googleAccessToken, googleMiddlewareToken } = result;
				const { email, firstName, lastName, role } = result.user;
				const token = result.token;
				const user = { email, firstName, lastName, token, role };
				console.log('obj of googleLogin:', user);
				
				const storageItems = {
					'user-info': JSON.stringify(user),
					'googleRefreshToken': googleRefreshToken,
					'googleAccessToken': googleAccessToken,
					'googleMiddlewareToken': googleMiddlewareToken
				};

				Object.entries(storageItems).forEach(([key, value]) => localStorage.setItem(key, value));

				setIsGoogleAuth(true);
				// Save user data in Redux state
				dispatch(loginSuccess(user));
				navigate("/home");

			} else {
				// console.log("error in googlelogin:",authResult);
				setIsGoogleAuth(false);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: 'auth-code'
	})
	return (
		<div>
			<button onClick={googleLogin} className='border border-blue-400 mt-1 hover:text-white hover:bg-blue-400 p-1 rounded-lg bg-blue-400'>Login With Google</button>
		</div>
	)
}
GoogleLogin.propTypes = {
	setIsGoogleAuth: PropTypes.func,
};
export default GoogleLogin