import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import PelangganList from "./components/pelanggan/PelangganList.js";
import PelangganForm from "./components/pelanggan/PelangganForm.js";
import BarangList from "./components/barang/BarangList.js";
import BarangForm from "./components/barang/BarangForm.js";
import PenjualanList from "./components/penjualan/PenjualanList.js";
import PenjualanForm from "./components/penjualan/PenjualanForm.js";
import ItemPenjualanList from "./components/penjualan/item/ItemPenjualanList.js";
import ItemPenjualanForm from "./components/penjualan/item/ItemPenjualanForm.js";
import Account from "./components/account/Account.js";
import Welcome from './components/Welcome.js'

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Welcome />} />

          <Route exact path="/pelanggan" element={<PelangganList />} />
          <Route exact path="/pelanggan/tambah" element={<PelangganForm uri="/pelanggan/store" />} />
          <Route exact path="/pelanggan/ubah/:id" element={<PelangganForm uri="/pelanggan/update/" editUri="/pelanggan/edit/" />} />

          <Route exact path="/barang" element={<BarangList />} />
          <Route exact path="/barang/tambah" element={<BarangForm uri="/barang/store" />} />
          <Route exact path="/barang/ubah/:id" element={<BarangForm uri="/barang/update/" editUri="/barang/edit/" />} />

          <Route exact path="/penjualan" element={<PenjualanList />} />
          <Route exact path="/penjualan/tambah" element={<PenjualanForm uri="/penjualan/store" />} />
          <Route exact path="/penjualan/ubah/:id" element={<PenjualanForm uri="/penjualan/update/" editUri="/penjualan/edit/" />} />

          <Route exact path="/penjualan/item/:id" element={<ItemPenjualanList uri="/penjualan/detail/" />} />
          <Route exact path="/item-penjualan/tambah/:id_nota" element={<ItemPenjualanForm uri="/item-penjualan/store/" editUri="/item-penjualan/edit/" />} />
          <Route exact path="/item-penjualan/ubah/:id_nota/:nota/:kode_barang" element={<ItemPenjualanForm uri="/item-penjualan/update/" editUri="/item-penjualan/edit/" />} />

          <Route exact path="/akun" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
