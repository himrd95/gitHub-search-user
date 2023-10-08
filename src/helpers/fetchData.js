import { baseUrl } from "../constants";

export const getUsers = (userName, endPoint, shouldSort) => {
	const formattedUrl = shouldSort
		? `${baseUrl}/${endPoint}?q=${userName}&sort=followers`
		: `${baseUrl}/${endPoint}/${userName}`;

	return fetch(formattedUrl);
};
