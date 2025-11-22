from sqlalchemy.orm import Session
from ..models.dictionary import Dictionary

def seed_dictionaries(db: Session):
    """
    Seed database with initial dictionary data if empty.
    """
    # Check if data already exists
    if db.query(Dictionary).count() > 0:
        print("Dictionary data already exists. Skipping seed.")
        return

    print("Seeding dictionary data...")
    
    # Data from Dataset Bahasa Ngapak Purbalingga
    initial_data = [
        {"source": "Berat", "target": "Abot", "ex_src": "Berat sekali bawaanku.", "ex_tgt": "Abot banget gawananku."},
        {"source": "Jauh", "target": "Adoh", "ex_src": "Rumah kamu jauh apa tidak?", "ex_tgt": "Umahmu adoh apa ora?"},
        {"source": "Mandi", "target": "Adus", "ex_src": "Aku belum mandi sedari pagi.", "ex_tgt": "Nyongurung adus kawit esuk."},
        {"source": "Jangan", "target": "Aja", "ex_src": "Jangan makan di depan pintu.", "ex_tgt": "Aja mangan nang ngarep lawang."},
        {"source": "Bagus", "target": "Apik", "ex_src": "Gambar dia bagus sekali, ya!", "ex_tgt": "Gambare kae apik banget ya!"},
        {"source": "Ingin", "target": "Arep", "ex_src": "Aku mau makan dulu.", "ex_tgt": "Nyong arep madang disit."},
        {"source": "Saja", "target": "Bae", "ex_src": "Apa mau seperti ini saja?", "ex_tgt": "Apa arep kaya kiye bae?"},
        {"source": "Sama sekali", "target": "Blas", "ex_src": "Aku tidak tahu sama sekali.", "ex_tgt": "Nyong ora ngerti blas."},
        {"source": "Pegang", "target": "Cekel", "ex_src": "Ini harus dipegang agar tidak jatuh.", "ex_tgt": "Kiye kudu dicekel ben ora tiba."},
        {"source": "Gigit", "target": "Cokot", "ex_src": "Kalau keras ya harus digigit.", "ex_tgt": "Angger alot ya kudu dicokot."},
        {"source": "Sendirian", "target": "Dhewekan", "ex_src": "Kemarin aku di rumah sendirian.", "ex_tgt": "Wingi nyong nang umah dhewekan."},
        {"source": "Main/Berkunjung", "target": "Dolan", "ex_src": "Jangan lupa main, ya!", "ex_tgt": "Aja kelalen dolan ya!"},
        {"source": "Jelek", "target": "Elek", "ex_src": "Orang itu punya watak jelek sekali.", "ex_tgt": "Wong kae duwe watek elek banget."},
        {"source": "Sayang", "target": "Eman", "ex_src": "Sayang sekali tidak bisa dipakai.", "ex_tgt": "Eman temen ora teyeng dinggo."},
        {"source": "Ringan", "target": "Entheng", "ex_src": "Anak itu massanya ringan sekali.", "ex_tgt": "Bocah kae bobote entheng banget."},
        {"source": "Bergegas", "target": "Gagehan", "ex_src": "Ayo bergegas biar tidak terlambat.", "ex_tgt": "Ayuh gagehan mbok telat."},
        {"source": "Kering", "target": "Garing", "ex_src": "Jemuranku kering semua hari ini.", "ex_tgt": "Pemeanku garing kabeh dina kiye."},
        {"source": "Dahulu", "target": "Gemiyen", "ex_src": "Dahulu, aku sekolah di kota.", "ex_tgt": "Gemiyen nyong sekolah nang kota."},
        {"source": "Sampai", "target": "Gutul", "ex_src": "Kira-kira pukul berapa sampai di Klaten?", "ex_tgt": "Kira-kira jam pira gutul Klaten?"},
        {"source": "Malu", "target": "Isin", "ex_src": "Aku malu kalau disuruh menari.", "ex_tgt": "Nyong isin nek kon nari."},
        {"source": "Nama", "target": "Jeneng", "ex_src": "Siapa namamu?", "ex_tgt": "Sapa jenengmu?"},
        {"source": "Kesal", "target": "Jengkel", "ex_src": "Aku sedang kesal dengannya.", "ex_tgt": "Nyong lagi jengkel karo kae."},
        {"source": "Teman", "target": "Kanca", "ex_src": "Teman kecilku sudah menjadi sukses.", "ex_tgt": "Kanca cilikku wis pada sukses."},
        {"source": "Bersama", "target": "Karo", "ex_src": "Aku dan kamu bermain di pantai.", "ex_tgt": "Nyong karo koe dolan nang pantai."},
        {"source": "Telanjur", "target": "Kebanjur", "ex_src": "Sudah telanjut, mau bagaimana lagi.", "ex_tgt": "Wis kebanjur, ya kepriwe maning."},
        {"source": "Lupa", "target": "Kelalen", "ex_src": "Jangan lupa besok ke rumahku, ya!", "ex_tgt": "Aja kelalen ngesuk ming nggonku, ya!"},
        {"source": "Ingat", "target": "Kelingan", "ex_src": "Aku kadang teringat dengan temanku yang jauh.", "ex_tgt": "Nyong kadang kelingan karo kanca adohku."},
        {"source": "Lapar", "target": "Kencot", "ex_src": "Aku sudah lapar sekali.", "ex_tgt": "Nyong wis kencot pisan."},
        {"source": "Sini", "target": "Kene", "ex_src": "Di sini saja, ya.", "ex_tgt": "Nang kene bae, ya."},
        {"source": "Bagaimana", "target": "Kepriwe", "ex_src": "Kamu bagaimana kabarnya?", "ex_tgt": "Ko kepriwe kabare?"},
        {"source": "Capek", "target": "Kesel", "ex_src": "Hari ini rasanya capek sekali.", "ex_tgt": "Dina kiye rasane kesel pisan."},
        {"source": "Terburu-buru", "target": "Kesusu", "ex_src": "Duluan ya, aku sedang terburu-buru.", "ex_tgt": "Disitan ya, nyong lagi kesusu."},
        {"source": "Kelamaan", "target": "Kesuwen", "ex_src": "Maaf ya kutinggalkan karena kamu kelamaan.", "ex_tgt": "Maaf ya tek tinggal soale koe kesuwen."},
        {"source": "Terima kasih", "target": "Kesuwun", "ex_src": "Terima kasih sekali atas bantuanmu.", "ex_tgt": "Kesuwun banget ya bantuane koe."},
        {"source": "Ini", "target": "Kiye", "ex_src": "Pakai sepatu ini saja.", "ex_tgt": "Nganggo sepatu kiye bae."},
        {"source": "Baju", "target": "Klambi", "ex_src": "Beli model baju ini saja.", "ex_tgt": "Tuku model klambi kiye bae."},
        {"source": "Kamu", "target": "Koe", "ex_src": "Kamu mau sama siapa?", "ex_tgt": "Koe arep karo sapa?"},
        {"source": "Sana", "target": "Kono", "ex_src": "Liburan di sana saja.", "ex_tgt": "Preian nang kono bae."},
        {"source": "Itu", "target": "Kuwe", "ex_src": "Maksudnya bukan seperti itu.", "ex_tgt": "Maksude ora kaya kuwe."},
        {"source": "Pergi", "target": "Lunga", "ex_src": "Adikku mau pergi ke pasar.", "ex_tgt": "Adiku arep lunga ming pasar."},
        {"source": "Makan", "target": "Mangan", "ex_src": "Aku makan lauk sate.", "ex_tgt": "Nyong mangan lawuh sate."},
        {"source": "Kekenyangan", "target": "Mblenger", "ex_src": "Rasanya aku sudah terlalu kekenyangan.", "ex_tgt": "Rasane nyong wis mblenger banget."},
        {"source": "Menakutkan", "target": "Medeni", "ex_src": "Hujannya sangat menakutkan.", "ex_tgt": "Udane medeni banget."},
        {"source": "Nanti", "target": "Mengko", "ex_src": "Nanti aku traktir kalau sudah mendapatkan gaji.", "ex_tgt": "Mengko tek traktir nek wis gajian."},
        {"source": "Berjalan", "target": "Mlaku", "ex_src": "Aku senang sekali berjalan di tepi pantai.", "ex_tgt": "Nyong seneng banget mlaku nang pinggir pantai"},
        {"source": "Lari", "target": "Mlayu", "ex_src": "Jangan lari-lari di jalan raya.", "ex_tgt": "Aja mlayu-mlayu nang ndalan gedhe."},
        {"source": "Turun", "target": "Mudhun", "ex_src": "Simbah tidak dapat turun dari pohon kelapa.", "ex_tgt": "Simbah ora teyeng mudhun sekang wit klapa."},
        {"source": "Naik", "target": "Munggah", "ex_src": "Kemarin aku diajak naik gunung.", "ex_tgt": "Wingi nyong dijaki munggah gunung."},
        {"source": "Menonton", "target": "Ndeleng", "ex_src": "Bapak sedang menonton acara sepak bola di TV.", "ex_tgt": "Bapak lagi ndeleng acara bal-balan neng tipi."},
        {"source": "Gemeteran", "target": "Ndredeg", "ex_src": "Aku gemeteran karena kelaparan.", "ex_tgt": "Nyong ndredeg merga kencoten."},
        {"source": "Pindah", "target": "Ngalih", "ex_src": "Budi pindah duduk ke belakang agar lebih nyaman.", "ex_tgt": "Budi ngalih njagong neng mburi ben luwih kepenak."},
        {"source": "Memakai", "target": "Nganggo", "ex_src": "Besok Senin pakai seragam apa?", "ex_tgt": "Ngesuk Senen nganggo seragam apa?"},
        {"source": "Sampai", "target": "Nganti", "ex_src": "Sampai kapan akan begini terus?", "ex_tgt": "Nganti kapan arep kaya kiye terus?"},
        {"source": "Kenapa", "target": "Ngapa", "ex_src": "Kenapa tidak ganti dengan yang baru?", "ex_tgt": "Ngapa ora ganti sing anyar?"},
        {"source": "Memotong rumput", "target": "Ngarit", "ex_src": "Andi membantu bapak memotong rumput di sawah.", "ex_tgt": "Andi ngrewangi bapake ngarit nang sawah."},
        {"source": "Istirahat", "target": "Ngaso", "ex_src": "Kalau capek, istirahat dulu.", "ex_tgt": "Nek kesel ya ngaso disit."},
        {"source": "Membagikan", "target": "Ngedum", "ex_src": "Ibu membagikan jeruk secara adil.", "ex_tgt": "Ibu ngedum jeruk ben adil."},
        {"source": "Mengajak", "target": "Ngejak", "ex_src": "Aku mengajak dirimu mau apa tidak?", "ex_tgt": "Nyong ngejak koe gelem po ora?"},
        {"source": "Pusing", "target": "Ngelu", "ex_src": "Kepalaku pusing sekali sehabis kena panas.", "ex_tgt": "Sirahku ngelu banget bar panasan."},
        {"source": "Ke mana", "target": "Ngendi", "ex_src": "Mau ke mana lagi setelah ini?", "ex_tgt": "Arep ngendi maning bar kiye?"},
        {"source": "Ke sini", "target": "Ngeneh", "ex_src": "Ke sini saja, yuk!", "ex_tgt": "Ming ngeneh bae, yuh!"},
        {"source": "Besok", "target": "Ngesuk", "ex_src": "Besok aku ikut ke Bali, ya!", "ex_tgt": "Ngesuk nyong melu menyang Bali, ya!"},
        {"source": "Membawa", "target": "Nggawa", "ex_src": "Adi membawa jajan ke sekolah.", "ex_tgt": "Adi nggawa jajan nang sekolahan."},
        {"source": "Membuat", "target": "Nggawe", "ex_src": "Ibu membuat nastar sebelum lebaran.", "ex_tgt": "Ibu nggawe nastar seurunge bada."},
        {"source": "Ya", "target": "Nggih", "ex_src": "Ya, Bu, terima kasih.", "ex_tgt": "Nggih, Bu, matur nuwun."},
        {"source": "Buat apa", "target": "Nggo ngapa", "ex_src": "Mangkuknya mau buat apa?", "ex_tgt": "Mangkoke arep nggo ngapa?"},
        {"source": "Mencari", "target": "Nggolet", "ex_src": "Aku mau mencari kunci motor yang kemarin hilang.", "ex_tgt": "Nyong arep nggolet kunci motor sing wingi ilang."},
        {"source": "Minum", "target": "Nginum", "ex_src": "Setelah makan jangan lupa minum.", "ex_tgt": "Bar mangan aja kelalen nginum/ngombe."},
        {"source": "Mengira", "target": "Ngira", "ex_src": "Aku tidak mengira dirimu mengingkari.", "ex_tgt": "Nyong ora ngira koe mblenjani."},
        {"source": "Berenang", "target": "Nglangi", "ex_src": "Bebek berenang di sungai.", "ex_tgt": "Bebek nglangi nang kali."},
        {"source": "Memasukkan", "target": "Nglebokna", "ex_src": "Jangan lupa memasukkan bekal di tasmu.", "ex_tgt": "Aja kelalen nglebokna bekal nang tasmu."},
        {"source": "Melipat", "target": "Nglempit", "ex_src": "Ibu sedang melipat baju di ruang tamu.", "ex_tgt": "Ibu lagi nglempit klambi nang ruang tamu."},
        {"source": "Bisa", "target": "Teyeng", "ex_src": "Aku dapat mengerjakan soal ulangan itu.", "ex_tgt": "Nyong teyeng nggarap soal ulangan kuwe."},
        {"source": "Mengeluh", "target": "Ngresula", "ex_src": "Jadi anak jangan suka mengeluh.", "ex_tgt": "Dadi bocah aja seneng ngresula."},
        {"source": "Mencuci", "target": "Ngumbah", "ex_src": "Hari Minggu saatnya mencuci motor.", "ex_tgt": "Dina Minggu jatahe ngumbah motor."},
        {"source": "Duduk", "target": "Njagong", "ex_src": "Jangan duduk di depan pintu.", "ex_tgt": "Aja njagong nang ngarep lawang."},
        {"source": "Berdiri", "target": "Njanggleng", "ex_src": "Berdiri saja biar kelihatan.", "ex_tgt": "Njanggleng bae ben keton."},
        {"source": "Bekerja", "target": "Nyambut gawe", "ex_src": "Bapak berangkat bekerja pukul 7 pagi.", "ex_tgt": "Bapak mangkat nyambut gawe jam 7 esuk."},
        {"source": "Menjemput", "target": "Nyamper", "ex_src": "Jangan lupa menjemputku, ya!", "ex_tgt": "Aja kelalen nyamper nyong, ya!"},
        {"source": "Membawa di tangan", "target": "Nyangking", "ex_src": "Setiap ke pasar, Ibu membawa tas belajaan di tangan.", "ex_tgt": "Angger masar, Ibu nyangking tas belanjaan."},
        {"source": "Memanggil", "target": "Nyeluk", "ex_src": "Aku memanggil Ardi tapi tidak terdengar.", "ex_tgt": "Nyong nyeluk Ardi tapi ora krungu."},
        {"source": "Meminjam", "target": "Nyilih", "ex_src": "Ani suka meminjam pulpen ke Ami.", "ex_tgt": "Ani seneng nyilih pulpen ming Ami."},
        {"source": "Saya", "target": "Nyong", "ex_src": "Aku tidak tahu mana yang salah.", "ex_tgt": "Nyong ora ngerti sing endi sing salah."},
        {"source": "Menyalakan", "target": "Nyumet", "ex_src": "Kalau mati listrik, Ibu meyalakan lilin.", "ex_tgt": "Angger mati listri, Ibu nyumet lilin."},
        {"source": "Tidak", "target": "Ora", "ex_src": "Tidak mungkin aku akan mengingkari.", "ex_tgt": "Ora mungkin nyong bakal mblenjani."},
        {"source": "Dekat", "target": "Perek", "ex_src": "Rumahku dekat dengan rumahmu.", "ex_tgt": "Umaku perek karo umahmu."},
        {"source": "Berapa", "target": "Pira", "ex_src": "Berapa ini harganya?", "ex_tgt": "Pira kiye regane?"},
        {"source": "Selesai", "target": "Rampung", "ex_src": "Tugasku sudah selesai dari kemarin.", "ex_tgt": "Tugasku wis rampung kawit wingi."},
        {"source": "Siapa", "target": "Sapa", "ex_src": "Siapa yang tidak berangkat hari ini?", "ex_tgt": "Sapa sing ora mangkat dina kiye?"},
        {"source": "Kereta Api", "target": "Sepur", "ex_src": "Nuna senang sekali naik kereta api ke Jogja.", "ex_tgt": "Nuna seneng banget numpak sepur menyang Jogja."},
        {"source": "Sekarang", "target": "Siki", "ex_src": "Sekarang aku bekerja di Jakarta.", "ex_tgt": "Siki nyong kerja nang Jakarta."},
        {"source": "Matahari", "target": "Srengenge", "ex_src": "Matahari hari ini panas banget.", "ex_tgt": "Srengenge dina kiye semelet temen."},
        {"source": "Banget", "target": "Temen", "ex_src": "Kamu senang banget makan seblak.", "ex_tgt": "Koe seneng temen mangan seblak."},
        {"source": "Beneran", "target": "Temenan", "ex_src": "Beneran tidak membonceng aku saja?", "ex_tgt": "Temenan ora mbonceng nyong bae?"},
        {"source": "Bukan", "target": "Udu", "ex_src": "Bukan seperti itu yang kumaksud.", "ex_tgt": "Udu kaya kuwe sing tek maksud."},
        {"source": "Rumah", "target": "Umah", "ex_src": "Aku pulang ke rumah seminggu sekali.", "ex_tgt": "Nyong bali umah seminggu pisan."},
        {"source": "Kenyang", "target": "Wareg", "ex_src": "Ani kenyang makan sate dua porsi.", "ex_tgt": "Ani wareg mangan sate rong porsi."},
        {"source": "Melihat", "target": "Weruh", "ex_src": "Aku melihat kecelakaan di sana.", "ex_tgt": "Nyong weruh tabrakan nang kana."},
        {"source": "Kemarin", "target": "Wingi", "ex_src": "Kemarin aku pergi ke pasar bersama Ibu.", "ex_tgt": "Wingi nyong ming pasar karo Ibu."},
        {"source": "Sudah", "target": "Wis", "ex_src": "Aku sudah makan tadi pagi.", "ex_tgt": "Nyong wis mangan mau esuk."}
    ]

    count = 0
    for item in initial_data:
        entry = Dictionary(
            source_text=item["source"].lower(),
            target_text=item["target"].lower(),
            source_lang="id",
            target_lang="jv_ngapak",
            example_source=item["ex_src"],
            example_target=item["ex_tgt"],
            category="word",
            dialect="Banyumasan",
            region="Purbalingga"
        )
        db.add(entry)
        count += 1
    
    db.commit()
    print(f"Successfully seeded {count} dictionary entries")
