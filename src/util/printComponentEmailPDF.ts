import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printAndEmailDocument = async (email: string, token:string) => {
    const input = document.getElementById("print");
    const ignore = document.getElementById("ignore");

    if (ignore){
        ignore.style.display = 'none';
    }

    if (input) {
        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                logging: false,
                scrollY: -window.scrollY,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            const blobPdf = new Blob([pdf.output('blob')], { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('pdf', blobPdf, 'document.pdf');
            formData.append('email', email);

            const response = await fetch('http://localhost:8080/api/v1/email/send-pdf-email', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (ignore) {
                ignore.style.display = 'block';
            }
        }
    }
}
