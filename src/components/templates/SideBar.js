import { Link, useLocation } from 'react-router-dom'

const SideBar = () => {
	const { pathname } = useLocation()

	const closeNav = () => {
		document.getElementById("sideNav").style.width = "0"
		document.getElementById("main").style.marginLeft= "0"
	}

	return (
		<div id="sideNav" className="sidenav">
			<span className="closebtn" onClick={() => closeNav()}>&times;</span>
			<Link to="/pelanggan" className={pathname === '/pelanggan' ? 'active' : ''}>Pelanggan</Link>
			<Link to="/barang" className={pathname === '/barang' ? 'active' : ''}>Barang</Link>
			<Link to="/penjualan" className={pathname === '/penjualan' ? 'active' : ''}>Penjualan</Link>
			<Link to="/akun" className={pathname === '/akun' ? 'active' : ''}>Akun</Link>
		</div>
	)
}

export default SideBar