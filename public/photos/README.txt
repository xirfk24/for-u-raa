===============================================
    CARA MENAMBAHKAN FOTO KENANGAN
===============================================

1. SIMPAN FOTO KE FOLDER INI
   - Letakkan foto-foto kalian di folder "photos" ini

2. NAMA FILE FOTO
   - foto1.jpg  -> Foto pertama (kotak kiri atas)
   - foto2.jpg  -> Foto kedua
   - foto3.jpg  -> Foto ketiga
   - foto4.jpg  -> Foto keempat
   - foto5.jpg  -> Foto kelima
   - foto6.jpg  -> Foto keenam (kotak kanan bawah)

3. FORMAT YANG DIDUKUNG
   - .jpg / .jpeg
   - .png
   - .gif
   - .webp

4. TIPS
   - Gunakan foto dengan ukuran persegi (1:1) untuk hasil terbaik
   - Ukuran yang disarankan: 500x500 pixel atau lebih
   - Kompres foto jika file terlalu besar agar loading cepat

5. MENGGANTI CAPTION FOTO
   Buka file index.html, cari bagian "photoConfig" dan edit caption:

   const photoConfig = [
       { src: 'photos/foto1.jpg', caption: 'Tulis caption di sini' },
       { src: 'photos/foto2.jpg', caption: 'Caption foto 2' },
       // dst...
   ];

6. MENAMBAH LEBIH BANYAK FOTO
   - Edit file index.html
   - Tambah div gallery-item baru
   - Tambah entry baru di photoConfig

===============================================
   Selamat membuat kenangan indah! 💕
===============================================
