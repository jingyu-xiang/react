import { useReducer, useEffect, useState } from "react";
import axios from "axios";

const initialState = {
	data: null,
	isPending: false,
	error: null,
	success: false,
};

const axiosGetReducer = (state, action) => {
	switch (action.type) {
		case "INVALID_INPUT":
			return { isPending: false, data: null, success: false, error: action.payload };
		case "IS_PENDING":
			return { isPending: true, data: null, success: false, error: null };
		case "ERROR":
			return { isPending: false, data: null, success: false, error: action.payload };
		case "RETRIEVED":
			return { isPending: false, data: action.payload, success: true, error: null };
		default:
			return state;
	}
};

export const useAxiosGet = (url, headers = {}) => {
	const [response, dispatch] = useReducer(axiosGetReducer, initialState);
	const [options, setOptions] = useState({ method: "GET", url: url, headers: { ...headers } });
	const [requestAgain, setRequestAgain] = useState(false);

	const updateUrl = (url) => {
		setOptions({ ...options, url });
	};

	const updateHeaders = (headers) => {
		setOptions({ ...options, headers });
	};

	const requstAfterChange = () => {
		setRequestAgain((prevRequestAgain) => !prevRequestAgain);
	};

	useEffect(() => {
		const controller = new AbortController();

		// process crud requests
		const processRequest = async (axiosPayload) => {
			dispatch({ type: "IS_PENDING" });

			try {
				const axiosResponse = await axios({ ...axiosPayload, signal: controller.signal });

				const axiosResponseOk = axiosResponse && axiosResponse.status < 400;
				if (!axiosResponseOk) {
					throw new Error(axiosResponse.statusText);
				}

				const axiosData = await axiosResponse.data;
				dispatch({ type: "RETRIEVED", payload: axiosData });
			} catch (error) {
				error.name === "AbortError"
					? dispatch({ type: "ERROR", payload: "the axios request is aborted" })
					: dispatch({ type: "ERROR", payload: error.message });
			}
		};

		processRequest(options);

		return () => {
			controller.abort();
		};
	}, [options, requestAgain]);

	return { response, updateUrl, updateHeaders, requstAfterChange };
};
