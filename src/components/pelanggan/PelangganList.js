import React from 'react'
import Datatables from '../templates/Datatables.js'
import SideBar from '../templates/SideBar.js'
import OpenNavBtn from '../templates/OpenNavBtn.js'

const PelangganList = () => {
	const tbody = ['id_pelanggan', 'nama', 'domisili', 'jenis_kelamin']

	const thead = ['ID Pelanggan', 'Nama', 'Domisili', 'Jenis Kelamin']

	return (
		<div>
			<SideBar />

			<div id="main">
				<OpenNavBtn />

				<div className="mb-5">
					<h3 className="bold">Pelanggan</h3>
				</div>

				<Datatables 
					uri="/pelanggan"
					tbody={ tbody }
					thead={ thead }
					deleteField="nama"
					deleteUri="/pelanggan/delete/"
					createUri="/pelanggan/tambah"
					updateUri="/pelanggan/ubah/"
					title="Pelanggan"
				/>
			</div>
		</div>
	)
}

export default PelangganList