function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero">
        <p className="eyebrow">About Us</p>
        <h1>Η τεχνογνωσία συναντά την εξέλιξη</h1>
        <p className="lead">
          Η MADS ιδρύθηκε το 2017 και δραστηριοποιείται στον χώρο των μπαταριών παντός τύπου.
          Από το 2018 εξειδικευόμαστε στην επισκευή, συντήρηση και βελτίωση ηλεκτρικών
          πατινιών και ηλεκτρικών σκούτερ.
        </p>
      </section>

      <section className="about-grid">
        <article className="panel">
          <h2>Η αποστολή μας</h2>
          <p>
            Ως επίσημη αντιπροσωπεία διαθέτουμε πλήρη γκάμα ηλεκτρικών πατινιών και e-scooters
            με τεχνική υποστήριξη, κάλυψη εγγύησης και γνήσια ανταλλακτικά.
          </p>
        </article>
        <article className="panel">
          <h2>Γιατί MADS</h2>
          <p>
            Με εμπειρία στις μπαταρίες και τεχνογνωσία στα ηλεκτρικά οχήματα, προσφέρουμε
            ποιότητα και αξιόπιστη εξυπηρέτηση πριν και μετά την αγορά.
          </p>
        </article>
      </section>

      <section className="panel">
        <h2>Οι υπηρεσίες μας</h2>
        <ul className="simple-list">
          <li>Πώληση ηλεκτρικών πατινιών και ηλεκτρικών σκούτερ</li>
          <li>Τεχνική υποστήριξη, επισκευές και συντήρηση</li>
          <li>Κάλυψη εγγύησης για όλα τα προϊόντα</li>
          <li>Μεγάλη ποικιλία γνήσιων ανταλλακτικών και μπαταριών</li>
          <li>Εξειδικευμένες λύσεις βελτίωσης επιδόσεων και αυτονομίας</li>
        </ul>
      </section>

      <section className="about-grid">
        <article className="panel">
          <h2>Κατάστημα</h2>
          <p>Λεωνίδα Ιασωνίδου 23, Θεσσαλονίκη</p>
          <p>
            Τηλέφωνο: <a href="tel:2310262805">2310 262805</a>
          </p>
          <p>
            Email: <a href="mailto:info@mads.gr">info@mads.gr</a>
          </p>
        </article>
        <article className="panel">
          <h2>Ωράριο λειτουργίας</h2>
          <ul className="hours-list">
            <li>
              <span>Δευτέρα</span>
              <span>09:00 - 16:00</span>
            </li>
            <li>
              <span>Τρίτη</span>
              <span>09:00 - 20:00</span>
            </li>
            <li>
              <span>Τετάρτη</span>
              <span>09:00 - 16:00</span>
            </li>
            <li>
              <span>Πέμπτη</span>
              <span>09:00 - 20:00</span>
            </li>
            <li>
              <span>Παρασκευή</span>
              <span>09:00 - 20:00</span>
            </li>
            <li>
              <span>Σάββατο</span>
              <span>10:00 - 15:00</span>
            </li>
            <li>
              <span>Κυριακή</span>
              <span>Κλειστά</span>
            </li>
          </ul>
        </article>
      </section>
    </div>
  )
}

export default AboutPage
