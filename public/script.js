document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('items');
    const form = document.getElementById('addItemForm');

    // Fetch and display items
    fetch('/items')
        .then(res => res.json())
        .then(items => {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - $${item.price}`;
                itemList.appendChild(li);
            });
        });

    // Add new item
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;

        fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price })
        })
            .then(res => res.json())
            .then(data => {
                const li = document.createElement('li');
                li.textContent = `${data.added.name} - $${data.added.price}`;
                itemList.appendChild(li);
                form.reset();
            });
    });
});
