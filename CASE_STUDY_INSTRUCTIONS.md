# Case Study Generation Instructions

When the user asks you to create a new case study, follow these exact steps to ensure consistency, anonymity, and proper integration into the website.

## 1. Gather Information
If the user hasn't provided enough detail, ask them for:
- The market or industry (e.g., Fintech, Healthcare, Retail).
- The primary outcome or achievement (e.g., "Reduced cloud costs by 40%", "Scaled to 1M users").
- A brief description of the technical challenges and the solution implemented.

## 2. Enforce Anonymity
- **CRITICAL:** Never mention specific company names, client names, or employer names in the case study text.
- Refer to clients generically (e.g., "a leading European bank", "a coalition of independent retailers", "a fast-growing fintech startup").
- Focus the narrative on the technical challenges, the scale of the problem, the architecture/solution, and the measurable outcomes.

## 3. Generate the Case Study Page
- Duplicate the `case-study-template.html` file and rename it appropriately (e.g., `case-study-fintech-scaling.html`).
- Fill in the placeholders (`[Case Study Title]`, `[Market/Industry]`, `[Key Metric/Scale]`, `[Your Role/Contribution]`).
- Write the content for "The Challenge", "The Solution", and "The Outcome" based on the gathered information. Keep it professional, outcome-oriented, and easy to understand.
- **Images:** Find a relevant, high-quality placeholder image from Unsplash. Use a URL format like `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200&q=80`. Update the `src` and `alt` attributes of the `.case-study-hero-img`.

## 4. Update the Main Page (`index.html`)
- Open `index.html`.
- Locate the `<div class="case-studies-grid">` section.
- Add a new `<a href="[new-file-name].html" class="case-card">` block inside the grid.
- Use a smaller version of the same Unsplash image for the thumbnail (`w=600`).
- Ensure the `case-market` and `h3` title match the newly created case study page.

### Example Grid Item HTML:
```html
<a href="case-study-new-project.html" class="case-card">
    <div class="case-thumb">
        <img src="https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=600&q=80" alt="[Description]" loading="lazy">
    </div>
    <div class="case-info">
        <span class="case-market">[Market]</span>
        <h3>[Case Study Title]</h3>
    </div>
</a>
```

## 5. Verification
- Ensure the new HTML file is created and saved.
- Ensure `index.html` is updated with the new card.
- Confirm that no identifiable company names are present in the generated text.