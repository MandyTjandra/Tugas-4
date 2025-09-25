document.addEventListener('DOMContentLoaded', function () {

    // =================================================================
    // BAGIAN 1: LOGIKA UNTUK FORM REGISTRASI DENGAN AUTOCOMPLETE
    // =================================================================

    // Simulasi data nama mahasiswa dari database
    const dataNamaMahasiswa = [
        "Andi Pratama", "Budi Santoso", "Citra Lestari", "Dewi Anggraini",
        "Eka Wijaya", "Fajar Nugroho", "Gunawan Budiman", "Hesti Puspita"
    ];

    const inputNama = document.getElementById('namaMahasiswa');
    const rekomendasiBox = document.getElementById('rekomendasiNama');

    inputNama.addEventListener('input', function () {
        const inputText = this.value;
        closeAllLists(); // Tutup rekomendasi yang sudah ada
        if (!inputText) return false;

        rekomendasiBox.innerHTML = '';

        // Filter data nama yang cocok dengan input
        const rekomendasi = dataNamaMahasiswa.filter(nama =>
            nama.toLowerCase().includes(inputText.toLowerCase())
        );

        // Tampilkan hasil filter
        rekomendasi.forEach(nama => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${nama.substr(0, inputText.length)}</strong>${nama.substr(inputText.length)}`;
            item.addEventListener('click', function () {
                inputNama.value = nama;
                closeAllLists();
            });
            rekomendasiBox.appendChild(item);
        });
    });

    function closeAllLists() {
        rekomendasiBox.innerHTML = '';
    }

    // Menutup rekomendasi jika diklik di luar area
    document.addEventListener("click", function (e) {
        if (e.target !== inputNama) {
            closeAllLists();
        }
    });


    // =================================================================
    // BAGIAN 2 & 3: LOGIKA PENCARIAN KODE POS & DROPDOWN DINAMIS
    // =================================================================

    // Simulasi data wilayah & kode pos dari database (DATA SUDAH DITAMBAHKAN)
    const dataWilayah = {
        "DKI Jakarta": {
            "Jakarta Pusat": {
                "Menteng": "10310",
                "Gambir": "10110",
                "Tanah Abang": "10230",
                "Cempaka Putih": "10510"
            },
            "Jakarta Selatan": {
                "Kebayoran Baru": "12110",
                "Tebet": "12810",
                "Pancoran": "12780",
                "Mampang Prapatan": "12790"
            },
            "Jakarta Barat": {
                "Palmerah": "11480",
                "Kebon Jeruk": "11530",
                "Cengkareng": "11730"
            },
            "Jakarta Timur": {
                "Matraman": "13110",
                "Jatinegara": "13310",
                "Cakung": "13910"
            },
            "Jakarta Utara": {
                "Koja": "14210",
                "Kelapa Gading": "14240",
                "Pademangan": "14410"
            }
        },
        "Jawa Barat": {
            "Bandung": {
                "Coblong": "40132",
                "Sukajadi": "40161",
                "Kiaracondong": "40281",
                "Lengkong": "40261"
            },
            "Bogor": {
                "Bogor Tengah": "16125",
                "Bogor Selatan": "16132",
                "Bogor Barat": "16113"
            },
            "Bekasi": {
                "Bekasi Timur": "17111",
                "Bekasi Barat": "17131",
                "Bekasi Utara": "17121"
            },
            "Depok": {
                "Beji": "16421",
                "Cimanggis": "16451",
                "Sawangan": "16511"
            }
        },
        "Jawa Timur": {
            "Surabaya": {
                "Gubeng": "60281",
                "Tegalsari": "60262",
                "Wonokromo": "60243",
                "Sukolilo": "60119"
            },
            "Malang": {
                "Klojen": "65111",
                "Lowokwaru": "65141",
                "Sukun": "65147",
                "Blimbing": "65126"
            },
            "Sidoarjo": {
                "Waru": "61256",
                "Buduran": "61252",
                "Candi": "61271",
                "Taman": "61257"
            }
        },
        "Sumatera Utara": {
            "Medan": {
                "Medan Petisah": "20112",
                "Medan Baru": "20152",
                "Medan Tembung": "20221",
                "Medan Denai": "20226"
            },
            "Deli Serdang": {
                "Lubuk Pakam": "20511",
                "Percut Sei Tuan": "20371",
                "Batang Kuis": "20562"
            }
        },
        "Banten": {
            "Tangerang": {
                "Cipondoh": "15148",
                "Karawaci": "15115",
                "Pinang": "15145",
                "Ciledug": "15151"
            },
            "Serang": {
                "Curug": "42171",
                "Taktakan": "42162",
                "Kasemen": "42191"
            }
        },
        "DI Yogyakarta": {
            "Yogyakarta": {
                "Danurejan": "55211",
                "Gedong Tengen": "55271",
                "Kotagede": "55172"
            },
            "Sleman": {
                "Depok": "55281",
                "Ngaglik": "55581",
                "Mlati": "55284"
            },
            "Bantul": {
                "Banguntapan": "55191",
                "Kasihan": "55182",
                "Sewon": "55188"
            }
        }
    };

    const selectProvinsi = document.getElementById('provinsi');
    const selectKabupaten = document.getElementById('kabupaten');
    const selectKecamatan = document.getElementById('kecamatan');
    const hasilDiv = document.getElementById('hasilKodePos');

    // 1. Isi dropdown Provinsi saat halaman dimuat
    for (const provinsi in dataWilayah) {
        const option = new Option(provinsi, provinsi);
        selectProvinsi.add(option);
    }

    // 2. Event listener saat Provinsi dipilih
    selectProvinsi.addEventListener('change', function () {
        resetDropdown(selectKabupaten, "-- Pilih Kabupaten/Kota --");
        resetDropdown(selectKecamatan, "-- Pilih Kecamatan --");
        hasilDiv.style.display = 'none';

        const provTerpilih = this.value;
        if (provTerpilih) {
            selectKabupaten.disabled = false;
            const dataKabupaten = dataWilayah[provTerpilih];
            for (const kabupaten in dataKabupaten) {
                selectKabupaten.add(new Option(kabupaten, kabupaten));
            }
        } else {
            selectKabupaten.disabled = true;
            selectKecamatan.disabled = true;
        }
    });

    // 3. Event listener saat Kabupaten/Kota dipilih
    selectKabupaten.addEventListener('change', function () {
        resetDropdown(selectKecamatan, "-- Pilih Kecamatan --");
        hasilDiv.style.display = 'none';

        const provTerpilih = selectProvinsi.value;
        const kabTerpilih = this.value;

        if (kabTerpilih) {
            selectKecamatan.disabled = false;
            const dataKecamatan = dataWilayah[provTerpilih][kabTerpilih];
            for (const kecamatan in dataKecamatan) {
                selectKecamatan.add(new Option(kecamatan, kecamatan));
            }
        } else {
            selectKecamatan.disabled = true;
        }
    });

    // 4. Event listener saat Kecamatan dipilih -> Tampilkan hasil
    selectKecamatan.addEventListener('change', function () {
        const provTerpilih = selectProvinsi.value;
        const kabTerpilih = selectKabupaten.value;
        const kecTerpilih = this.value;

        if (kecTerpilih) {
            const kodePos = dataWilayah[provTerpilih][kabTerpilih][kecTerpilih];
            hasilDiv.innerHTML = `
                Daerah: ${kecTerpilih}, ${kabTerpilih}, ${provTerpilih} <br>
                <strong>Kode Pos: ${kodePos}</strong>
            `;
            hasilDiv.style.display = 'block';
        } else {
            hasilDiv.style.display = 'none';
        }
    });

    // Fungsi bantuan untuk mereset dropdown
    function resetDropdown(selectElement, defaultText) {
        selectElement.innerHTML = '';
        selectElement.add(new Option(defaultText, ""));
    }
});
