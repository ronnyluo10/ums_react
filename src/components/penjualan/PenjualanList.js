import React from 'react'
import Datatables from '../templates/Datatables.js'
import SideBar from '../templates/SideBar.js'
import OpenNavBtn from '../templates/OpenNavBtn.js'

const PenjualanList = () => {
	const tbody = ['id_nota', 'tgl', 'kode_pelanggan', 'subtotal']

	const thead = ['ID Nota', 'Tgl', 'Kode Pelanggan', 'Subtotal']

	return (
		<div>
			<SideBar />

			<div id="main">
				<OpenNavBtn />

				<div className="mb-5">
					<h3 className="bold">Penjualan</h3>
				</div>

				<Datatables 
					uri="/penjualan"
					tbody={ tbody }
					thead={ thead }
					deleteField="id_nota"
					deleteUri="/penjualan/delete/"
					createUri="/penjualan/tambah"
					updateUri="/penjualan/ubah/"
					detailUri="/penjualan/item"
					title="Penjualan"
				/>
			</div>
		</div>
	)
}

export default PenjualanList