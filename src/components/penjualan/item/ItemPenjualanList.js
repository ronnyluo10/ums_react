import React from 'react'
import Datatables from '../../templates/Datatables.js'
import { Link, useParams } from 'react-router-dom'

const ItemPenjualanList = () => {
	const tbody = ['nota', 'kode_barang', 'qty']

	const thead = ['Nota', 'Kode Barang', 'Qty']

	const { id } = useParams()

	return (
		<div>
			<div className="mb-5">
				<div className="flex mt-5">
					<div>
						<Link to="/penjualan">
							<svg className="svg-icon" viewBox="0 0 20 20">
								<path fill="black" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
								L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
								c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
								c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
								S18.707,9.212,18.271,9.212z"></path>
							</svg>
						</Link>
					</div>
					<div className="ml-5 pt-1">
						<h3 className="bold">
							<span>Item Penjualan</span>
						</h3>
					</div>
				</div>
			</div>

			<Datatables 
				uri={ '/penjualan/detail/'+id }
				tbody={ tbody }
				thead={ thead }
				deleteUri="/item-penjualan/delete/"
				createUri={ '/item-penjualan/tambah/'+id }
				updateUri="/item-penjualan/ubah"
				moreField={ ['nota', 'kode_barang'] }
				encryptField="nota_value"
				title="Item Penjualan"
			/>
		</div>
	)
}

export default ItemPenjualanList