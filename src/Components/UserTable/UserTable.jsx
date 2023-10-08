import React from "react";
import "./UserTable.css";
import { Player } from "@lottiefiles/react-lottie-player";
import { useMemo } from "react";
import { LOTTIE_URLS, getUserEndpoint } from "../../constants";
import { memo } from "react";
import { useState } from "react";
import cx from "classnames";
import { useCallback } from "react";
import { getUsers } from "../../helpers/fetchData";
import { useEffect } from "react";

const UserTable = ({ users, isQuery }) => {
	const [active, setActive] = useState(null);
	const [selectedUser, setSelectedUser] = useState({});
	const [loading, setLoading] = useState(false);

	const lottieUrlToRender = useMemo(() => {
		if (isQuery) {
			return LOTTIE_URLS.NOT_FOUND;
		} else return LOTTIE_URLS.HOME;
	}, [isQuery]);

	const handleClickStrip = useCallback(
		(index, userName) => {
			if (active || !selectedUser) {
				return;
			}
			setLoading(true);
			setSelectedUser({});
			setActive(index);

			getUsers(userName, getUserEndpoint)
				.then((res) => res.json())
				.then((res) => {
					setSelectedUser(res);
				})
				.catch((err) => {
					console.error("error", err);
				})
				.finally(() => setLoading(false));
		},
		[active, selectedUser],
	);

	useEffect(() => {
		document.addEventListener("click", (evt) => {
			if (
				evt.target.closest(".card") ||
				evt.target.closest(".user-info")
			) {
				return;
			}
			if (!active) {
				setActive(false);
				setSelectedUser({});
			}
		});
	}, [active]);

	return (
		<div>
			<div className="line-separator"></div>
			{users && users.length > 0 ? (
				users.map((user, index) => (
					<div
						key={`${index}_${user.login}`}
						className="card"
						style={{ animationDelay: `0.${index + 1}s` }}
						onClick={() => handleClickStrip(index, user.login)}
					>
						<img
							src={user.avatar_url}
							className="user_avatar"
							alt={user.login}
						/>

						<h3>{user.login}</h3>

						<div className="external_link_icon">
							<i class="fa-solid fa-arrow-up-right-from-square"></i>
						</div>

						<div
							id="popup"
							className={cx(
								"popup",
								active === index && "active_card",
							)}
						>
							<div>
								<img
									src={user?.avatar_url}
									className="card_user_avatar"
									alt={user.login}
								/>
							</div>

							{!loading ? (
								<div class="user-info">
									<div className="redirect_button">
										<a href={selectedUser?.html_url} target="blank">
											{selectedUser?.name
												? selectedUser?.name
												: user.login}
											<i class="fa-solid fa-arrow-up-right-from-square"></i>
										</a>
									</div>

									<p>{selectedUser?.bio}</p>
									<ul>
										<li>
											{selectedUser?.followers}
											<strong>Followers </strong>
										</li>

										<li>
											{selectedUser?.following}
											<strong>Following </strong>
										</li>

										<li>
											{selectedUser?.public_repos}
											<strong>Repos </strong>
										</li>
									</ul>

									<div className="information">
										* Click anywhere ontside this poppup to close
										this.
									</div>
								</div>
							) : (
								<div>
									<div class="card__image loading"></div>
									<div class="card__title loading"></div>
									<div class="card__description loading"></div>
								</div>
							)}
						</div>
					</div>
				))
			) : (
				<Player
					src={lottieUrlToRender}
					autoplay
					loop
					style={{ width: "40%", marginTop: "-50px" }}
				></Player>
			)}
		</div>
	);
};

export default memo(UserTable);
