@php
    $hasDiscount = $record->discount_price !== null;
@endphp

<div style="display: flex; flex-direction: column; padding: 0.5rem 0.75rem;">
    @if ($hasDiscount)
        <span style="font-size: 0.875rem; color: #9ca3af; text-decoration: line-through;">
            {{ \Illuminate\Support\Number::currency((float) $record->price, 'USD') }}
        </span>
        <span style="font-size: 0.875rem; font-weight: 600; color: #16a34a;">
            {{ \Illuminate\Support\Number::currency((float) $record->discount_price, 'USD') }}
        </span>
    @else
        <span style="font-size: 0.875rem; font-weight: 600; color: #16a34a;">
            {{ \Illuminate\Support\Number::currency((float) $record->price, 'USD') }}
        </span>
    @endif
</div>
