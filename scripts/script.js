


const baseUsers = [
    { name: 'Jane Cooper', company: 'Microsoft', phone: '(225) 555-0117', email: 'jane@microsoft.com', country: 'United States', active: false },
    { name: 'Floyd Miles', company: 'Yahoo', phone: '(285) 555-0117', email: 'floyd@yahoo.com', country: 'Kiribati', active: false },
    { name: 'Ronald Richards', company: 'Adobe', phone: '(205) 555-0116', email: 'ronald@adobe.com', country: 'Israel', active: false },
    { name: 'Marvin McKinney', company: 'Tesla', phone: '(225) 555-0115', email: 'marvin@tesla.com', country: 'Iran', active: false },
    { name: 'Jerome Bell', company: 'Google', phone: '(225) 555-0114',email: 'jerome@google.com', country: 'Réunion', active: false },
    { name: 'Kathryn Murphy', company: 'Microsoft', phone: '(205) 555-0107', email: 'kathryn@microsoft.com', country: 'Curaçao', active: false },
    { name: 'Jacob Jones', company: 'Yahoo', phone: '(255) 555-0117', email: 'jacob@yahoo.com', country: 'Brazil', active: false },
    { name: 'Kristin Watson', company: 'Facebook', phone: '(225) 555-0111', email: 'kristin@facebook.com', country: 'Åland Islands', active: false }
];

const users = [];
for (let i = 0; i < 32; i++) { 
    users.push(...baseUsers.map(user => ({ ...user })));
}

const rowsPerPage = 8;
let currentPage = 1;
let isAnimating = false;

function displayUsers(page) {
    const userList = document.querySelector('#userList');
    userList.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        row.appendChild(nameCell);

        const companyCell = document.createElement('td');
        companyCell.textContent = user.company;
        row.appendChild(companyCell);

        const phoneCell = document.createElement('td');
        phoneCell.textContent = user.phone;
        row.appendChild(phoneCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        const countryCell = document.createElement('td');
        countryCell.textContent = user.country;
        row.appendChild(countryCell);

        const activeCell = document.createElement('td');
        activeCell.classList.add('user__table-td', 'user__table-td-status');
        const activeButton = document.createElement('button');
        activeButton.textContent = user.active ? 'Active' : 'Inactive';
        activeButton.className = user.active ? 'active-status' : 'inactive-status';
        activeButton.onclick = () => {
            user.active = !user.active;
            activeButton.textContent = user.active ? 'Active' : 'Inactive';
            activeButton.className = user.active ? 'active-status' : 'inactive-status';
        };
        activeCell.appendChild(activeButton);
        row.appendChild(activeCell);

        userList.appendChild(row);
    });
}

function setupPagination() {
    const prevPage = document.querySelector('#prevPage');
    const nextPage = document.querySelector('#nextPage');
    const pageNumbers = document.querySelector('#pageNumbers');
    const pageCount = Math.ceil(users.length / rowsPerPage);

    function createPageButton(page) {
        const button = document.createElement('button');
        button.textContent = page;
        button.classList.add('page-number');
        if (page === currentPage) {
            button.classList.add('active');
        }
        button.onclick = () => {
            if (isAnimating || currentPage === page) return;
            isAnimating = true;
            const direction = currentPage < page ? 1 : -1;
            currentPage = page;
            animatePageChange(direction);
            updatePagination();
        };
        return button;
    }

    function updatePagination() {
        pageNumbers.innerHTML = '';

        if (currentPage <= 4) {
            for (let i = 1; i <= Math.min(4, pageCount); i++) {
                pageNumbers.appendChild(createPageButton(i));
            }
            if (pageCount > 4) {
                const dots = document.createElement('button');
                dots.textContent = '...';
                dots.classList.add("dots");
                dots.onclick = () => {
                    updatePaginationRange(5, Math.min(8, pageCount));
                };
                pageNumbers.appendChild(dots);
                pageNumbers.appendChild(createPageButton(pageCount));
            }
        } else if (currentPage > 4 && currentPage < pageCount - 3) {
            pageNumbers.appendChild(createPageButton(1));
            const dots1 = document.createElement('button');
            dots1.textContent = '...';
            dots1.onclick = () => {
                updatePaginationRange(currentPage - 2, currentPage);
            };
            pageNumbers.appendChild(dots1);

            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pageNumbers.appendChild(createPageButton(i));
            }

            const dots2 = document.createElement('button');
            dots2.textContent = '...';
            dots2.onclick = () => {
                updatePaginationRange(currentPage + 2, Math.min(currentPage + 4, pageCount));
            };
            pageNumbers.appendChild(dots2);
            pageNumbers.appendChild(createPageButton(pageCount));
        } else {
            pageNumbers.appendChild(createPageButton(1));
            const dots = document.createElement('button');
            dots.textContent = '...';
            dots.onclick = () => {
                updatePaginationRange(pageCount - 7, pageCount - 4);
            };
            pageNumbers.appendChild(dots);
            for (let i = pageCount - 3; i <= pageCount; i++) {
                pageNumbers.appendChild(createPageButton(i));
            }
        }

        if (currentPage === 1) {
            prevPage.disabled = true;
        } else {
            prevPage.disabled = false;
        }

        if (currentPage === pageCount) {
            nextPage.disabled = true;
        } else {
            nextPage.disabled = false;
        }
    }

    function updatePaginationRange(start, end) {
        pageNumbers.innerHTML = '';
        pageNumbers.appendChild(createPageButton(1));
        if (start > 2) {
            const dots1 = document.createElement('button');
            dots1.textContent = '...';
            dots1.onclick = () => {
                updatePaginationRange(start - 3, start - 1);
            };
            pageNumbers.appendChild(dots1);
        }

        for (let i = start; i <= end && i <= pageCount; i++) {
            pageNumbers.appendChild(createPageButton(i));
        }

        if (end < pageCount - 1) {
            const dots2 = document.createElement('button');
            dots2.textContent = '...';
            dots2.onclick = () => {
                updatePaginationRange(end + 1, Math.min(end + 3, pageCount));
            };
            pageNumbers.appendChild(dots2);
        }
        pageNumbers.appendChild(createPageButton(pageCount));
    }

    prevPage.onclick = () => {
        if (isAnimating || currentPage <= 1) return;
        isAnimating = true;
        currentPage--;
        animatePageChange(-1);
        updatePagination();
    };

    nextPage.onclick = () => {
        if (isAnimating || currentPage >= pageCount) return;
        isAnimating = true;
        currentPage++;
        animatePageChange(1);
        updatePagination();
    };

    updatePagination();
}

function animatePageChange(direction) {
    const userTable = document.querySelector('#userTable');
    userTable.style.transform = `translateX(${direction * 100}%)`;

    setTimeout(() => {
        userTable.style.transition = 'none';
        displayUsers(currentPage);
        userTable.style.transform = `translateX(${-direction * 100}%)`;
        setTimeout(() => {
            userTable.style.transition = 'transform 0.5s ease-in-out';
            userTable.style.transform = 'translateX(0)';
            isAnimating = false;
        }, 50);
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    displayUsers(currentPage);
    setupPagination();
});

const burgerMenu = document.querySelector("#burger-menu");
const sidebar = document.querySelector("#sidebar");
const closeBtn = document.querySelector("#close-btn");

burgerMenu.addEventListener("click", () => {
    sidebar.style.display = "block";
    burgerMenu.style.display = "none";
    closeBtn.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    sidebar.style.display = "none";
    burgerMenu.style.display = "block";
    closeBtn.style.display = "none";
})



