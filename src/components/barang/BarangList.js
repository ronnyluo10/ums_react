import React from 'react'
import Datatables from '../templates/Datatables.js'
import SideBar from '../templates/SideBar.js'
import OpenNavBtn from '../templates/OpenNavBtn.js'

const BarangList = () => {
	const tbody = ['kode', 'nama', 'kategori', 'harga']

	const thead = ['Kode', 'Nama', 'Kategori', 'Harga']

	return (
		<div>
			<SideBar />

			<div id="main">
				<OpenNavBtn />

				<div className="mb-5">
					<h3 className="bold">Barang</h3>
				</div>

				<Datatables 
					uri="/barang"
					tbody={ tbody }
					thead={ thead }
					deleteField="nama"
					deleteUri="/barang/delete/"
					createUri="/barang/tambah"
					updateUri="/barang/ubah/"
					title="Barang"
				/>
			</div>
		</div>
	)
}

export default BarangList