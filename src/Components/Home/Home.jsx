import React, { useState } from "react";
import "./Home.css";
import SearchBar from "../SearchBar/SearchBar";
import UserTable from "../UserTable/UserTable";
import { useEffect } from "react";
import { getUsers } from "../../helpers/fetchData";
import { useCallback } from "react";
import {
	LOTTIE_URLS,
	delaySearch,
	searchEndPoint,
} from "../../constants";
import { useMemo } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const Home = () => {
	const [userName, setUserName] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	const isQuery = useMemo(
		() => userName.length >= 1,
		[userName.length],
	);

	const getAllUsers = useCallback(() => {
		if (!isQuery) {
			setLoading(false);
			setUsers([]);
			return;
		}

		getUsers(userName, searchEndPoint, true)
			.then((res) => res.json())
			.then((res) => {
				setUsers(res.items);
			})
			.catch((err) => {
				console.error("error", err);
			})
			.finally(() => setLoading(false));
	}, [isQuery, userName]);

	useEffect(() => {
		isQuery && setLoading(true);
		let timer;
		clearTimeout(timer);

		timer = setTimeout(() => {
			getAllUsers();
		}, delaySearch);

		return () => clearTimeout(timer);
	}, [getAllUsers, isQuery]);

	return (
		<div>
			<h2 className="heading">GitHub user search</h2>
			<SearchBar userName={userName} setUserName={setUserName} />
			{loading ? (
				<Player
					src={LOTTIE_URLS.LAZY_LOADING}
					autoplay
					loop
					style={{ width: "40%" }}
				></Player>
			) : (
				<UserTable
					isQuery={isQuery}
					users={users}
					loading={loading}
				/>
			)}
		</div>
	);
};

export default Home;
