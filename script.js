// 🌿 Rakesh Homeo Clinic - Master Script.js
// Offline LocalStorage + Edit/Delete + Sort + PDF Export

document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // 🔹 UTILITY FUNCTIONS
  // ============================================================
  const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const getData = key => JSON.parse(localStorage.getItem(key)) || [];

  // ============================================================
  // 🧍 PATIENT MANAGEMENT
  // ============================================================
  const patientForm = document.getElementById("patientForm");
  const patientList = document.getElementById("patientList");
  const searchPatient = document.getElementById("searchPatient");

  if (patientForm) {
    const renderPatients = (filter = "") => {
      const patients = getData("patients")
        .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
      patientList.innerHTML = patients.length
        ? patients.map((p, i) => `
          <div class="list-item">
            <strong>${p.name}</strong> (Age: ${p.age || "-"}, Contact: ${p.contact || "-"})
            <div class="actions">
              <button class="edit" data-index="${i}" data-type="patient">✏️</button>
              <button class="delete" data-index="${i}" data-type="patient">🗑️</button>
            </div>
          </div>
        `).join("")
        : "<p>No patients found.</p>";
    };

    patientForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("patientName").value.trim();
      const age = document.getElementById("patientAge").value.trim();
      const contact = document.getElementById("patientContact").value.trim();
      if (!name) return alert("Enter patient name");

      const patients = getData("patients");
      patients.push({ name, age, contact });
      saveData("patients", patients);
      patientForm.reset();
      renderPatients();
    });

    if (searchPatient) {
      searchPatient.addEventListener("input", e => renderPatients(e.target.value));
    }

    patientList?.addEventListener("click", e => {
      const index = e.target.dataset.index;
      const patients = getData("patients");
      if (e.target.classList.contains("delete")) {
        if (confirm("Delete this patient?")) {
          patients.splice(index, 1);
          saveData("patients", patients);
          renderPatients();
        }
      }
      if (e.target.classList.contains("edit")) {
        const p = patients[index];
        document.getElementById("patientName").value = p.name;
        document.getElementById("patientAge").value = p.age;
        document.getElementById("patientContact").value = p.contact;
        patients.splice(index, 1);
        saveData("patients", patients);
      }
    });

    renderPatients();
  }

  // ============================================================
  // 💊 MEDICINE MANAGEMENT
  // ============================================================
  const medicineForm = document.getElementById("medicineForm");
  const medicineList = document.getElementById("medicineList");
  const searchMedicine = document.getElementById("searchMedicine");

  if (medicineForm) {
    const renderMedicines = (filter = "") => {
      const meds = getData("medicines")
        .filter(m => m.name.toLowerCase().includes(filter.toLowerCase()));
      medicineList.innerHTML = meds.length
        ? meds.map((m, i) => `
          <div class="list-item">
            <strong>${m.name}</strong> — Stock: ${m.stock || "-"}
            <br><small>${m.note || ""}</small>
            <div class="actions">
              <button class="edit" data-index="${i}" data-type="medicine">✏️</button>
              <button class="delete" data-index="${i}" data-type="medicine">🗑️</button>
            </div>
          </div>
        `).join("")
        : "<p>No medicines found.</p>";
    };

    medicineForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("medicineName").value.trim();
      const stock = document.getElementById("medicineStock").value.trim();
      const note = document.getElementById("medicineNote").value.trim();
      if (!name) return alert("Enter medicine name");

      const meds = getData("medicines");
      meds.push({ name, stock, note });
      saveData("medicines", meds);
      medicineForm.reset();
      renderMedicines();
    });

    if (searchMedicine) {
      searchMedicine.addEventListener("input", e => renderMedicines(e.target.value));
    }

    medicineList?.addEventListener("click", e => {
      const index = e.target.dataset.index;
      const meds = getData("medicines");
      if (e.target.classList.contains("delete")) {
        if (confirm("Delete this medicine?")) {
          meds.splice(index, 1);
          saveData("medicines", meds);
          renderMedicines();
        }
      }
      if (e.target.classList.contains("edit")) {
        const m = meds[index];
        document.getElementById("medicineName").value = m.name;
        document.getElementById("medicineStock").value = m.stock;
        document.getElementById("medicineNote").value = m.note;
        meds.splice(index, 1);
        saveData("medicines", meds);
      }
    });

    renderMedicines();
  }

  // ============================================================
  // 🩺 TREATMENT MANAGEMENT + PDF EXPORT + SORT
  // ============================================================
  const treatmentForm = document.getElementById("treatmentForm");
  const treatmentList = document.getElementById("treatmentList");
  const searchTreatment = document.getElementById("searchTreatment");
  const sortSelect = document.getElementById("sortTreatment");
  const exportBtn = document.getElementById("exportPDF");

  if (treatmentForm) {
    const renderTreatments = (filter = "", sortType = "latest") => {
      let treatments = getData("treatments")
        .filter(t => t.patient.toLowerCase().includes(filter.toLowerCase()));

      // Sorting logic
      treatments.sort((a, b) => {
        if (sortType === "latest") return new Date(b.date) - new Date(a.date);
        if (sortType === "oldest") return new Date(a.date) - new Date(b.date);
        return a.patient.localeCompare(b.patient);
      });

      treatmentList.innerHTML = treatments.length
        ? treatments.map((t, i) => `
          <div class="list-item">
            <strong>${t.patient}</strong> (${t.date || "—"})
            <br>Medicine: ${t.med || "—"}
            <br><small>${t.details || ""}</small>
            <div class="actions">
              <button class="edit" data-index="${i}" data-type="treatment">✏️</button>
              <button class="delete" data-index="${i}" data-type="treatment">🗑️</button>
            </div>
          </div>
        `).join("")
        : "<p>No treatment records.</p>";
    };

    treatmentForm.addEventListener("submit", e => {
      e.preventDefault();
      const patient = document.getElementById("treatPatientName").value.trim();
      const date = document.getElementById("treatDate").value.trim();
      const med = document.getElementById("treatMedicine").value.trim();
      const details = document.getElementById("treatDetails").value.trim();
      if (!patient || !details) return alert("Please fill required fields.");

      const treatments = getData("treatments");
      treatments.push({ patient, date, med, details });
      saveData("treatments", treatments);
      treatmentForm.reset();
      renderTreatments();
    });

    // Search
    searchTreatment?.addEventListener("input", e => renderTreatments(e.target.value, sortSelect?.value));

    // Sort dropdown
    sortSelect?.addEventListener("change", e => renderTreatments(searchTreatment?.value || "", e.target.value));

    // Edit/Delete
    treatmentList?.addEventListener("click", e => {
      const index = e.target.dataset.index;
      const treatments = getData("treatments");
      if (e.target.classList.contains("delete")) {
        if (confirm("Delete this treatment record?")) {
          treatments.splice(index, 1);
          saveData("treatments", treatments);
          renderTreatments();
        }
      }
      if (e.target.classList.contains("edit")) {
        const t = treatments[index];
        document.getElementById("treatPatientName").value = t.patient;
        document.getElementById("treatDate").value = t.date;
        document.getElementById("treatMedicine").value = t.med;
        document.getElementById("treatDetails").value = t.details;
        treatments.splice(index, 1);
        saveData("treatments", treatments);
      }
    });

    // PDF Export
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const treatments = getData("treatments");
        if (!treatments.length) return alert("No treatment data to export.");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Rakesh Homeo Clinic - Treatment Records", 10, 10);

        let y = 20;
        treatments.forEach((t, i) => {
          doc.text(`${i + 1}. ${t.patient} (${t.date || "-"})`, 10, y);
          y += 6;
          doc.setFontSize(10);
          doc.text(`Medicine: ${t.med}`, 10, y); y += 5;
          doc.text(`Details: ${t.details}`, 10, y); y += 10;
          if (y > 270) { doc.addPage(); y = 20; }
        });

        doc.save("Treatment_Records.pdf");
      });
    }

    renderTreatments();
  }
});