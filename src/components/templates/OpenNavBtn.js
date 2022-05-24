const OpenNavBtn = () => {
	const openNav = () => {
		document.getElementById("sideNav").style.width = "250px"
		document.getElementById("main").style.marginLeft = "250px"
	}

	return (
		<div className="openNavBtn mb-5" onClick={() => openNav()}>&#9776; Buka Menu</div>
	)
}

export default OpenNavBtn